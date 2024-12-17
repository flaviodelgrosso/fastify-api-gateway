import { MOCK_TARGET_URL } from './target.js'

/** @type {import('../../types/plugin.d.ts').GatewayRouteOptions[]} */
const routes = [
  {
    prefix: '/api',
    target: MOCK_TARGET_URL,
    method: ['GET']
  },
  {
    prefix: '/with-cache',
    target: MOCK_TARGET_URL,
    method: ['GET'],
    cache: true,
    ttl: 10000
  },
  {
    pathRegex: '',
    prefix: '/with-rate-limit',
    target: MOCK_TARGET_URL,
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
    target: MOCK_TARGET_URL,
    method: ['POST'],
    hooks: []
  },
  {
    pathRegex: '',
    prefix: '/with-body-limit',
    target: MOCK_TARGET_URL,
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
    target: MOCK_TARGET_URL
  },
  {
    pathRegex: '',
    prefixRewrite: '/rewritten',
    prefix: '/route-with-prefix-rewrite',
    target: MOCK_TARGET_URL,
    method: ['GET']
  },
  {
    pathRegex: '',
    prefix: '/route-with-middleware',
    target: MOCK_TARGET_URL,
    middlewares: [
      (req, res, done) => {
        res.setHeader('x-route-middleware', 'true')
        done()
      }
    ]
  }
]

export default routes
