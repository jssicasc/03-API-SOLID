import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  // Note-Que o refine permite fazer uma validação personalizada
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  // Lembrando que o parse já dará o throw new Error se for inválido
  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  // Não precisou envolver no try-catch pois não foi criado um erro específico para esse caso
  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send() // Lembrando-Que 201 simboliza sucesso na criação de um recurso
}
