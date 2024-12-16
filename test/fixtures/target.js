'use strict'

import Fastify from 'fastify'

function buildTarget() {
  const target = Fastify()

  target.get('/api/test', (req, res) => {
    res.send({ message: 'Hello, world!' })
  })

  target.get('/rewritten', (req, res) => {
    res.send({ message: 'OK' })
  })

  target.get('/with-rate-limit', (req, res) => {
    res.send({ message: 'OK' })
  })

  target.post('/without-body-limit', (req, res) => {
    res.send({ message: 'OK' })
  })

  target.post('/with-body-limit', (req, res) => {
    res.send({ message: 'OK' })
  })

  return target
}

export { buildTarget }
