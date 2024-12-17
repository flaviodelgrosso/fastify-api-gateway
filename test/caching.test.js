import { describe, before, test } from 'node:test'

import { buildApp } from './fixtures/app.js'
import { buildTarget } from './fixtures/target.js'

describe('caching', () => {
  let app

  before(async () => {
    app = buildApp()
    buildTarget()
    await app.ready()
  })

  test('should instance get decorated with cache property', async t => {
    t.plan(1)
    t.assert.ok(app.cache)
  })

  test
})
