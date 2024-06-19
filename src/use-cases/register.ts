import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}
export class RegisterUseCase {
  // ao colocar uma keyword de visibilidade no parâmetro que tá recebendo pelo construtor isso faz com que esse parâmetro automaticamente VIRE uma propriedade
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // o hash retorna uma Promise por isso o await
    // o 2º argumento indica com que base o hash é gerado, o salt seria algo aleatório e único da aplicação, e o nº de rounds, que seria o nº de vezes q o hash será [re]gerado, então quanto mais rounds mais difícil de ser descoberto, mas tbm mais pesado pro hash ser gerado, então não deve ser usado mtos round pra algo que seja requisitado mtas vezes na aplicação
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    // mesmo sendo uma única informação retornou ela dentro de um objeto para facilitar uma possível alteração futura, que aí só bastaria adiionar itens nesse objeto
    return { user }
  }
}
