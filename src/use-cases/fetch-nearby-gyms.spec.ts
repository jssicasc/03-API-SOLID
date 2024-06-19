import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearByGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsUseCase

describe('Fetch NearBy Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -13.0102876,
      longitude: -38.535374,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -12.6647997,
      longitude: -39.6083614,
    })

    const { gyms } = await sut.execute({
      userLatitude: -13.0102876,
      userLongitude: -38.535374,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
