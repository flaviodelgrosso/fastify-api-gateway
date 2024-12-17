import Fastify from 'fastify'
import { describe, test } from 'node:test'

import plugin from '../index.js'

describe('plugin registration', () => {
  test('should register successfully', async t => {
    const fastify = Fastify()
    await fastify.register(plugin, { routes: [] })

    t.assert.ok(fastify)
  })

  test('should throw when register is called without routes', async t => {
    const fastify = Fastify()

    await t.assert.rejects(async () => await fastify.register(plugin))
  })
})
