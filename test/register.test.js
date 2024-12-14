import Fastify from 'fastify'
import { test } from 'node:test'

import plugin from '../index.js'

test('should register successfully', async t => {
  const fastify = Fastify()

  await fastify.register(plugin, { routes: [] })

  t.assert.ok(fastify)
})

test('should throw when register is called without routes', async t => {
  const fastify = Fastify()

  await t.assert.rejects(async () => await fastify.register(plugin))
})
