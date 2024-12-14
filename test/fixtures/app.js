'use strict'

import Fastify from 'fastify'
import plugin from '../../index.js'
import routes from './routes-config.js'

function buildApp(opts = {}) {
  const app = Fastify(opts)
  app.register(plugin, {
    routes,
    rateLimitOptions: { global: false },
    middlewares: [
      (req, res, done) => {
        res.setHeader('x-global-middleware', 'true')
        done()
      }
    ]
  })

  return app
}

export { buildApp }
