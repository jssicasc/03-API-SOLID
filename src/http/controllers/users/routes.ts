import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate) // será recebido parâmetros por meio do BODY por isso utilizou o post
  // Para ficar mais semântico utilizou sessions (criação de sessão ficaria mais semântico que criação de authenticate)

  app.patch('/token/refresh', refresh) // rota responsável por atualizar o JWT

  /** Para acessar as rotas abaixo é necessário que o usuário esteja AUTENTICADO */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
