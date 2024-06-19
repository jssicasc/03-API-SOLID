import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// DECLARAÇÃO feita de modo global para que todos os testes tenham acesso (se declarasse dentro do beforeEach os testes não identificariam)
let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    // NOTE-QUE a Inicialização NÃO Foi feita globalmente com a Declaração para EVITAR Interferência de dados ENTRE os testes
    // Dentro do beforeEach cada teste terá seu Contexto ISOLADO de Dados
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'User test',
      email: 'user@test.com',
      password: '123456',
    })

    // toEqual(expect.any(String)) verifica se user.id é qualquer coisa do tipo string
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'User test',
      email: 'user@test.com',
      password: '123456',
    })

    // realiza a comparação da senha com um hash já existente, retornando true se a senha indicada realmente tenha originado o hash indicado
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'user@test.com'

    await sut.execute({
      name: 'User test',
      email,
      password: '123456',
    })

    // Como o execute é uma função assíncrona então há 2 possibilidades para o RETORNO da Promise: Resolves OU Rejects
    // Ao colocar a Promise dentro do expect é possível verificar qual foi a possibilidade que ocorreu
    // Neste caso espera que a Promise dê (reject) e que o erro seja uma instância de UserAlreadyExistsError
    // Como dentro do expect tem uma promise, utiliza o await para garantir que o vitest não vai avançar sem conferir
    await expect(() =>
      sut.execute({
        name: 'User test',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
