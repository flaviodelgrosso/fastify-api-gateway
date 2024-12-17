import type {
  FastifyPluginAsync,
  RouteOptions,
  RawServerBase,
  RawServerDefault
} from 'fastify'
import { FastifyCachingPluginOptions } from '@fastify/caching'
import type { Handler, FastifyMiddieOptions } from '@fastify/middie'
import type {
  FastifyReplyFromHooks,
  FastifyReplyFromOptions
} from '@fastify/reply-from'
import type {
  RateLimitOptions,
  RateLimitPluginOptions
} from '@fastify/rate-limit'

declare module 'fastify' {
  export interface RouteShorthandOptions<
    RawServer extends RawServerBase = RawServerDefault
  > extends fastifyApiGateway.GatewayRouteOptions {}

  export interface RouteOptions extends fastifyApiGateway.GatewayRouteOptions {}
}

declare namespace fastifyApiGateway {
  type FastifyApiGatewayOptions = {
    /** The routes to register. */
    routes: GatewayRouteOptions[]
    /** Middlewares to apply to all routes. */
    middlewares?: Handler[]
    /** The rate limit configuration. */
    rateLimitOptions?: RateLimitOptions & RateLimitPluginOptions
    /** The reply.from options. */
    replyFromOptions?: FastifyReplyFromOptions
    /** The middie options. */
    middieOptions?: FastifyMiddieOptions
    /** The caching options. */
    cacheOptions?: FastifyCachingPluginOptions
  }

  interface GatewayRouteOptions
    extends Partial<Pick<RouteOptions, 'bodyLimit' | 'config' | 'method'>> {
    /** The prefix to match incoming requests. */
    prefix: string
    /** The target URL to forward requests to. */
    target: string
    /** The prefix to rewrite the incoming requests. */
    prefixRewrite?: string
    /** @default '/*' */
    pathRegex?: string
    /** Middlewares to apply to the route. */
    middlewares?: Handler[]
    /** Hooks to apply to the reply.from call. */
    hooks?: FastifyReplyFromHooks
    /** The caching segment to use. */
    cache?: boolean
    /** Time to live for the cache. */
    ttl?: number
  }

  export const fastifyApiGateway: FastifyApiGateway

  export {
    fastifyApiGateway as default,
    FastifyApiGatewayOptions,
    GatewayRouteOptions
  }
}

type FastifyApiGateway =
  FastifyPluginAsync<fastifyApiGateway.FastifyApiGatewayOptions>

declare function fastifyApiGateway(
  ...params: Parameters<FastifyApiGateway>
): ReturnType<FastifyApiGateway>

export = fastifyApiGateway
