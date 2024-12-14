'use strict'

import restana from 'restana'

function buildTarget() {
  const remote = restana()
  remote.get('/api/test', (req, res) => {
    res.send({ message: 'Hello, world!' })
  })

  remote.get('/rewritten', (req, res) => {
    res.send({ message: 'OK' })
  })

  remote.get('/with-rate-limit', (req, res) => {
    res.send({ message: 'OK' })
  })

  remote.post('/without-body-limit', (req, res) => {
    res.send({ message: 'OK' })
  })

  remote.post('/with-body-limit', (req, res) => {
    res.send({ message: 'OK' })
  })

  return remote
}

export { buildTarget }
