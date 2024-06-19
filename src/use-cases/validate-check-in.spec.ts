import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-tst',
      user_id: 'user-tst',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.itens[0].validated_at).toEqual(expect.any(Date))
    // Note-Que o teste criou APENAS UM check-in, então ele será o ÚNICO existente em checkInsRepository.itens
  })

  it('should not be able to validate an inexisten check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // Lembrando-que o horário padrão é UTC, e se fizer um console.log o horário é exibido em utc-3

    // então a data de criação será a definida no setSystemTime
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-tst',
      user_id: 'user-tst',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(Error)
  })
})
