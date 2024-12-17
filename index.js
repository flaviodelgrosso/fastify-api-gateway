'use strict'

/**
 * @typedef {import('fastify').FastifyInstance} FastifyInstance
 * @typedef {import('@fastify/middie').Handler} Middleware
 * @typedef {import('./types/plugin.js').GatewayRouteOptions} GatewayRouteOptions
 * @typedef {import('./types/plugin.js').FastifyApiGatewayOptions} FastifyApiGatewayOptions
 * @typedef {import('./types/plugin.js').GatewayHandler} GatewayHandler
 */

import fp from 'fastify-plugin'

const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD'
]

/**
 * Build the reply object with cache headers.
 * @param {GatewayRouteOptions} route
 * @param {import('fastify').FastifyReply} reply
 * @returns
 */
const buildReply = (route, reply) => {
  if (route.cache.etag) {
    reply.etag(route.cache.etag, route.cache.ttl)
  }

  if (route.cache.expires) {
    reply.expires(route.cache.expires)
  }

  return reply
}

/**
 * Create a handler for the gateway route that proxies the request to the target.
 * @type {GatewayHandler}
 */
const createGatewayHandler = (app, route) => async (request, reply) => {
  try {
    if (route.method === 'GET' && route.cache) {
      const cachedResponse = await app.cache.get(request.url)
      if (cachedResponse) {
        return buildReply(route, reply).send(cachedResponse)
      }
    }

    const newUrl = route.prefixRewrite
      ? request.url.replace(route.prefix, route.prefixRewrite)
      : request.url

    const response = await reply.from(route.target + newUrl, route.hooks)

    if (route.cache) {
      app.cache.set(request.url, response, route.ttl)
    }

    return reply.from(route.target + newUrl, route.hooks)
  } catch (error) {
    return reply.status(error.statusCode || 500).send({ error })
  }
}

/**
 * Register middlewares with Fastify.
 * @param {FastifyInstance} app
 * @param {Middleware[]} [middlewares]
 * @param {string} [prefix]
 */
function registerMiddlewares(app, middlewares = [], prefix = null) {
  for (const middleware of middlewares) {
    prefix ? app.use(prefix, middleware) : app.use(middleware)
  }
}

/**
 * Register routes with Fastify.
 * @param {FastifyInstance} app
 * @param {GatewayRouteOptions[]} routes
 */
function registerRoutes(app, routes) {
  for (const route of routes) {
    registerMiddlewares(app, route.middlewares, route.prefix)

    const pathRegex = route.pathRegex ?? '/*'
    const bodyLimit = route.bodyLimit ?? 1048576 // Default to 1 MB
    const methods = route.method ?? HTTP_METHODS

    app.route({
      method: methods,
      bodyLimit,
      url: `${route.prefix}${pathRegex}`,
      handler: createGatewayHandler(app, route),
      config: route.config
    })
  }
}

/**
 * Checks if there are any middlewares defined in the options.
 * @param {FastifyApiGatewayOptions} options
 * @returns {boolean}
 */
function hasMiddlewares(options) {
  return (
    options.middlewares?.length > 0 ||
    options.routes.some(route => route.middlewares?.length > 0)
  )
}

/**
 * @param {FastifyInstance} app
 * @param {FastifyApiGatewayOptions} options
 */
const gatewayPlugin = async (app, options) => {
  await app.register(import('@fastify/reply-from'), options.replyFromOptions)
  await app.register(import('@fastify/caching'), options.cacheOptions)

  // Register middie plugin if there are middlewares defined
  if (hasMiddlewares(options)) {
    await app.register(import('@fastify/middie'), options.middieOptions)
  }

  // Register rate-limit plugin if configured
  if (options.rateLimitOptions) {
    await app.register(import('@fastify/rate-limit'), options.rateLimitOptions)
  }

  registerMiddlewares(app, options.middlewares)
  registerRoutes(app, options.routes)
}

export default fp(gatewayPlugin, {
  fastify: '5.x',
  name: 'fastify-api-gateway'
})
