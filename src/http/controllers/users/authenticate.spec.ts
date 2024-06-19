import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    // como o objetivo é simular o procedimento real então primeiro utilizaria a rota de criação para depois autenticar
    await request(app.server).post('/users').send({
      name: 'User test e2e',
      email: 'userE2E@test.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'userE2E@test.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
