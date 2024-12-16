import { test } from 'node:test'

import { buildApp } from './fixtures/app.js'
import { buildTarget } from './fixtures/target.js'

const app = buildApp()
const target = buildTarget()

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

test('should return 200 when posting body with 26 KB to /without-body-limit', async t => {
  t.plan(1)

  const response = await app.inject({
    url: '/without-body-limit',
    method: 'POST',
    payload: { array: new Uint8Array(1024 * 3) }
  })

  t.assert.strictEqual(response.statusCode, 200)
})

test('should return 413 when posting body with 26 KB to /with-body-limit', async t => {
  t.plan(1)

  const response = await app.inject({
    url: '/with-body-limit',
    method: 'POST',
    payload: { array: new Uint8Array(1024 * 3) }
  })

  t.assert.strictEqual(response.statusCode, 413)
})

test('gateway handler should throw error on invalid url', async t => {
  t.plan(1)

  const response = await app.inject({
    url: '/invalid-url',
    method: 'GET'
  })

  t.assert.strictEqual(response.statusCode, 500)
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

test('shoud correctly rewrite prefix', async t => {
  t.plan(1)

  const response = await app.inject({
    url: '/route-with-prefix-rewrite',
    method: 'GET'
  })

  t.assert.deepEqual(response.statusCode, 200, 'Status code should be 200')
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
