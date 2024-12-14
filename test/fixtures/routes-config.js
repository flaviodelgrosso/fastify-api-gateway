const target = 'http://localhost:3001'

/** @type {import('../../types/plugin.d.ts').GatewayRouteOptions[]} */
const routes = [
  {
    prefix: '/api',
    target,
    method: ['GET']
  },
  {
    pathRegex: '',
    prefix: '/with-rate-limit',
    target,
    method: ['GET'],
    config: {
      rateLimit: {
        max: 2,
        timeWindow: 10000
      }
    }
  },
  {
    pathRegex: '',
    prefix: '/without-body-limit',
    target,
    method: ['POST'],
    hooks: []
  },
  {
    pathRegex: '',
    prefix: '/with-body-limit',
    target,
    bodyLimit: 25600,
    method: ['POST']
  },
  {
    pathRegex: '',
    prefix: '/invalid-url',
    target: 'invalid-url',
    method: ['GET']
  },
  {
    pathRegex: '',
    prefix: '/route-without-method',
    target
  },
  {
    pathRegex: '',
    prefixRewrite: '/rewritten',
    prefix: '/route-with-prefix-rewrite',
    target,
    method: ['GET']
  },
  {
    pathRegex: '',
    prefix: '/route-with-middleware',
    target,
    middlewares: [
      (req, res, done) => {
        res.setHeader('x-route-middleware', 'true')
        done()
      }
    ]
  }
]

export default routes
