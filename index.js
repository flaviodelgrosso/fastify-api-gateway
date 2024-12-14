'use strict'

/**
 * @typedef {import('fastify').FastifyInstance} FastifyInstance
 * @typedef {import('@fastify/middie').Handler} Middleware
 * @typedef {import('./types/plugin.js').GatewayRouteOptions} GatewayRouteOptions
 * @typedef {import('./types/plugin.js').FastifyApiGatewayOptions} FastifyApiGatewayOptions
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
 * @param {GatewayRouteOptions} route
 */
const createGatewayHandler = route => async (request, reply) => {
  try {
    const newUrl = route.prefixRewrite
      ? request.url.replace(route.prefix, route.prefixRewrite)
      : request.url

    return reply.from(route.target + newUrl, route.hooks)
  } catch (error) {
    return reply.status(error.statusCode || 500).send({ error })
  }
}

/**
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
      handler: createGatewayHandler(route),
      config: route.config
    })
  }
}

/**
 * @param {FastifyInstance} app
 * @param {FastifyApiGatewayOptions} options
 */
const gatewayPlugin = async (app, options) => {
  await app.register(import('@fastify/reply-from'))
  await app.register(import('@fastify/middie'))

  // Register rate-limit plugin if configured
  if (options.rateLimit) {
    await app.register(import('@fastify/rate-limit'), options.rateLimit)
  }

  registerMiddlewares(app, options.middlewares)
  registerRoutes(app, options.routes)
}

export default fp(gatewayPlugin, {
  fastify: '5.x',
  name: 'fastify-api-gateway'
})
