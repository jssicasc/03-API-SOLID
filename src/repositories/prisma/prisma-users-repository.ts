import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

// O objetivo é que esta classe contenha vários métodos que vão interceptar (ser porta de entrada) Para Qualquer OPERAÇÃO que será realizada no BD
export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  }

  async findByEmail(email: string) {
    // O findUnique APENAS realiza a busca em colunas indicadas com @unique E em colunas que são CHAVES Primárias, tanto é que a sugestão só exibe as colunas que satisfazem essa condição
    const user = await prisma.user.findUnique({ where: { email } })

    return user
  }

  // NOTE-QUE na integração com o TypeScript o prisma já gera as tipagens necessários para fazer as operações no BD
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
