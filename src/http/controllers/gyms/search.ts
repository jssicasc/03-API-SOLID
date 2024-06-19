import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  // OBS: Os parâmetros dentro de req.query vem como string, então é necessário converter
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  // Lembrando que o parse já dará o throw new Error se for inválido
  const { query, page } = searchGymsQuerySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({ gyms })
}
