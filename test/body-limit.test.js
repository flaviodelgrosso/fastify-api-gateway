import { before, test, describe } from 'node:test'

import { buildApp } from './fixtures/app.js'
import { buildTarget } from './fixtures/target.js'

describe('body limit', () => {
  let app

  before(() => {
    app = buildApp()
    buildTarget()
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
})
