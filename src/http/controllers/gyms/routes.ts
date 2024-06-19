import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { nearby } from './nearby'
import { search } from './search'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // Todas as rotas desse arquivo que vierem APÓS essa declaração vão passar por esse middleware de verificação de autenticação lol
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
}
