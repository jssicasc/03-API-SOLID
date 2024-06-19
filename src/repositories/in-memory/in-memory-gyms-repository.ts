import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearByParams } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordenates'

export class InMemoryGymsRepository implements GymsRepository {
  public itens: Gym[] = []

  async findManyNearBy(params: findManyNearByParams) {
    return this.itens.filter((item) => {
      const distance = getDistanceBetweenCoordinate(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      console.log(distance)
      // retorna as academias cadastradas que estão a menos que 10km do usuário
      return distance < 10
    })
  }

  async findById(id: string) {
    const gym = this.itens.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.itens
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.itens.push(gym)

    return gym
  }
}
