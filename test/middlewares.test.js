import { describe, before, test } from 'node:test'

import { buildApp } from './fixtures/app.js'
import { buildTarget } from './fixtures/target.js'

describe('middlewares', () => {
  let app

  before(() => {
    app = buildApp()
    buildTarget()
  })

  test('should execute global middleware and apply header', async t => {
    t.plan(1)

    const response = await app.inject({
      url: '/api/test',
      method: 'GET'
    })

    t.assert.deepEqual(
      response.headers['x-global-middleware'],
      'true',
      'Middleware should be executed'
    )
  })

  test('should execute route middleware and apply header', async t => {
    t.plan(1)

    const response = await app.inject({
      url: '/route-with-middleware',
      method: 'GET'
    })

    t.assert.deepEqual(
      response.headers['x-route-middleware'],
      'true',
      'Middleware should be executed'
    )
  })
})
