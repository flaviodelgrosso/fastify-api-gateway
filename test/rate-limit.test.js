import { describe, before, test } from 'node:test'

import { buildApp } from './fixtures/app.js'
import { buildTarget } from './fixtures/target.js'

describe('rate limit', () => {
  let app
  let target

  before(() => {
    app = buildApp()
    target = buildTarget()
  })

  test('should return 429 when exceeding rate limit', async t => {
    t.plan(4)

    target.persist()

    /** @type {import('fastify').InjectOptions} */
    const injectOptions = { method: 'GET', url: '/with-rate-limit' }

    let res

    res = await app.inject(injectOptions)
    t.assert.strictEqual(res.statusCode, 200)

    res = await app.inject(injectOptions)
    t.assert.strictEqual(res.statusCode, 200)

    res = await app.inject(injectOptions)
    t.assert.strictEqual(res.statusCode, 429)
    t.assert.deepStrictEqual(
      {
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded, retry in 10 seconds'
      },
      JSON.parse(res.payload)
    )
  })
})
