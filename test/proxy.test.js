import { describe, before, test } from 'node:test'

import { buildApp } from './fixtures/app.js'
import { buildTarget } from './fixtures/target.js'

describe('proxy', () => {
  let app

  before(() => {
    app = buildApp()
    buildTarget()
  })

  test('should forward request to target', async t => {
    t.plan(1)

    const response = await app.inject({
      url: '/api/test',
      method: 'GET'
    })

    t.assert.deepEqual(
      response.body,
      JSON.stringify({ message: 'Hello, world!' })
    )
  })

  test('gateway handler should throw error on invalid url', async t => {
    t.plan(1)

    const response = await app.inject({
      url: '/invalid-url',
      method: 'GET'
    })

    t.assert.strictEqual(response.statusCode, 500)
  })

  test('shoud correctly rewrite prefix', async t => {
    t.plan(1)

    const response = await app.inject({
      url: '/route-with-prefix-rewrite',
      method: 'GET'
    })

    t.assert.deepEqual(response.statusCode, 200, 'Status code should be 200')
  })
})
