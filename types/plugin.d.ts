import type {
  FastifyPluginAsync,
  RouteOptions,
  RawServerBase,
  RawServerDefault
} from 'fastify'
import type { Handler } from '@fastify/middie'
import type { FastifyReplyFromHooks } from '@fastify/reply-from'
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
    rateLimit?: RateLimitOptions & RateLimitPluginOptions
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
