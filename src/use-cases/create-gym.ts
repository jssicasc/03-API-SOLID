import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

// Vale destacar que opcional é DIFERENTE De null (pois undefined != null)
// Além disso há a sutil diferença entre Não Informar o dado (logo ele não será alterado), e informar um dado null (como se tivesse removendo a descrição)
interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
