import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })
    return checkIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({ where: { id } })
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date') // Em JS date significa O DIA (o DAY retornaria o Dia da Semana)
    const endtOfTheDay = dayjs(date).endOf('date') // retorna o último momento válido do dia

    // lembrando que o .findUnique só pode ser usado com colunas que estejam definidas com o @unique
    // gte é a sigla para Greater Then Or Equal, e lte significa Less Then Or Equal
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endtOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    // take define a quantidade de itens para pegar e o skip indica o indíce inicial (define a quantidade de itens que deseja pular)
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })
    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: { user_id: userId },
    })
    return count
  }
}
