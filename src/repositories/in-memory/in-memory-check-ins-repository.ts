import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public itens: CheckIn[] = []

  async save(checkIn: CheckIn) {
    const checkInIndex = this.itens.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.itens[checkInIndex] = checkIn
    }

    return checkIn
  }

  async findById(id: string) {
    const checkIn = this.itens.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async countByUserId(userId: string) {
    return this.itens.filter((item) => item.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number) {
    return this.itens
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    // O startOf retornará o começo dia (sem as horas)
    const startOfTheDay = dayjs(date).startOf('date') // Em JS date significa O DIA (o DAY retornaria o Dia da Semana)
    const endtOfTheDay = dayjs(date).endOf('date') // retorna o último momento válido do dia

    const checkInOnSameDate = this.itens.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endtOfTheDay)
      // NOTE-QUE há diversas possibilidades para fazer a verificação, MAS a preocupação com a melhor performance não é tão necessária NESTE contexto de método que está dentro de um repositório para testes

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.itens.push(checkIn)

    return checkIn
  }
}
