'use strict'

import nock from 'nock'

const MOCK_TARGET_URL = 'http://fastify-api-gateway.service.mock'

function buildTarget() {
  const target = nock(MOCK_TARGET_URL)

  target.get('/api/test').reply(200, { message: 'Hello, world!' })
  target.get('/rewritten').reply(200)
  target.get('/with-rate-limit').reply(200)
  target.post('/without-body-limit').reply(200)
  target.post('/with-body-limit').reply(200)

  return target
}

export { buildTarget, MOCK_TARGET_URL }
