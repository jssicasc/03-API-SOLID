import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    // Note-Que devido à validação de distância, as coordenadas da academia devem ser iguais ou próximas às coordenadas informadas para o user
    await gymsRepository.create({
      id: 'gym-tst',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    // "resetar" o uso do FakeTimers para evitar que os testes seguintes sejam impactados
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-tst',
      userId: 'user-tst',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // Desse modo garante que a criação destes 2 checkins ocorrerão nesta data definida (evita erros futuros em casos mais complexos)
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-tst',
      userId: 'user-tst',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-tst',
        userId: 'user-tst',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-tst',
      userId: 'user-tst',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-tst',
      userId: 'user-tst',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.itens.push({
      id: 'gym-tst-distance',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-12.985564),
      longitude: new Decimal(-38.4647676),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-tst-distance',
        userId: 'user-tst',
        userLatitude: -13.0102876,
        userLongitude: -38.535374,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
