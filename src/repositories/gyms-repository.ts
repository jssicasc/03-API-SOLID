import { Gym, Prisma } from '@prisma/client'

// como essas 2 informações são muito parecidas usou a interface para que ficasse mais descritivo
export interface findManyNearByParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearBy(params: findManyNearByParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
