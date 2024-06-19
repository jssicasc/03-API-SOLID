import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

// Em todo processo sempre tem as tipagens de Entrada (o que a pessoa precisa ENVIAR para a autenticação) e Saída (o que o processo deve devolver pra saber se o usuário foi autenticado ou não, o caso negativo seria dos erros)
// O uso "clássico" da autenticação é com email e senha
interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

// Uso do usersRepository já que a autenticação é de um usuário
export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  // A classe possui um único método que fará o processo de autenticação em si
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
