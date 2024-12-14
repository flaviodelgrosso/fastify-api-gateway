# Fastify API Gateway

[![NPM
version](https://img.shields.io/npm/v/fastify-api-gateway.svg?style=flat)](https://www.npmjs.com/package/fastify-api-gateway)
[![NPM
downloads](https://img.shields.io/npm/dm/fastify-api-gateway.svg?style=flat)](https://www.npmjs.com/package/fastify-api-gateway)
[![CI](https://github.com/flaviodelgrosso/fastify-api-gateway/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/flaviodelgrosso/fastify-api-gateway/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/flaviodelgrosso/fastify-api-gateway/graph/badge.svg?token=AARO0MBFOS)](https://codecov.io/github/flaviodelgrosso/fastify-api-gateway)

This library is a Fastify plugin that can be used as API Gateway that proxies requests to different backend services. It supports route-level and global middlewares, rate limits, and allows for URL prefix rewriting.

## Install

```bash
npm install fastify-api-gateway
```

### Compatibility

| Plugin version | Fastify version |
| ---------------|-----------------|
| `^1.x`         | `^5.x`          |

## Configuration

When registering the plugin it will register under the hood the following Fastify plugins:

- [fastify-reply-from](https://github.com/fastify/fastify-reply-from) plugin, which is used to proxy requests to the backend services.

Optionally, it can also register the following plugins:

- [fastify-rate-limit](https://github.com/fastify/fastify-rate-limit) plugin, which is used to rate limit requests. It is enabled only if `rateLimitOptions` is set.
- [fastify-middie](https://github.com/fastify/middie) plugin, which is used to apply middlewares on routes. It is enabled only if `middlewares` are found in the configuration.

The plugin accepts the following options:

- `routes`: The routes to register.
- `middlewares`: Middlewares to apply to all routes.
- `rateLimitOptions`: The rate limit configuration.
- `replyFromOptions`: The reply.from options.
- `middieOptions`: The middie options.
  
## Routes

Routes can be configured with the following properties:

- `prefix`: The URL prefix for the route.
- `target`: The target backend service URL.
- `bodyLimit`: (Optional) The maximum body size allowed for the route. Default is `1048576` (1MB).
- `method`: (Optional) The HTTP method to match for the route. Default is `*`.
- `pathRegex`: (Optional) A regular expression to match the path. Default is `/*`.
- `prefixRewrite`: (Optional) The URL prefix to rewrite to.
- `middlewares`: (Optional) An array of middlewares to apply to the route.
- `hooks`: (Optional) Additional hooks to pass to the `reply.from` method.
- `config`: (Optional) The Fastify route configuration object.

Rate limit can be configured at the route level or globally. If you want to disable the global rate limit, pass `false` to the `rateLimitOptions.global` property. Check the [docs](https://github.com/fastify/fastify-rate-limit) for all the configurations.

### Example

```javascript
const options = {
  rateLimitOptions: {
    global: false // Pass false if you want to disable the global rate limit and add configurations to the routes
  },
  replyFromOptions: {
    // reply.from options
  },
  middieOptions: {
    // middie options
  },
  middlewares: [
    // Global middlewares
  ],
  routes: [
    {
      method: 'GET',
      pathRegex: '/*',
      prefix: '/api',
      target: 'http://backend-service',
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute'
        }
      }
      prefixRewrite: '/backend',
      middlewares: [
        // Route-level middlewares
      ],
      hooks: {
        // Additional hooks
      }
    }
  ]
}

app.register(gatewayPlugin, options)
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
