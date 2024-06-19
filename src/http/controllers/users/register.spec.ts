import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // evento que indica que a aplicação terminou de ser inicializada
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    // lembrando-que o request espera o servidor NATIVO Do Node
    const response = await request(app.server).post('/users').send({
      name: 'User test e2e',
      email: 'userE2E@test.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
