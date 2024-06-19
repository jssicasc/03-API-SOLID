import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository) // a nomeclatura sut (System Under Test) indica qual é a principal entidade que está sendo testada, que nesse caso é o UseCase, isso evita erros ao renomear variáveis quando Copia&Cola
  })

  it('should be able to authenticate', async () => {
    // NOTE-QUE devido a INDEPENDÊNCIA Entre os Testes o RegisterUseCase NÃO Foi Utilizado
    await usersRepository.create({
      name: 'User test',
      email: 'user@test.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'user@test.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should no be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'user@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should no be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'User test',
      email: 'user@test.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'user@test.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
