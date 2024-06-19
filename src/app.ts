import { ZodError } from 'zod'
import { env } from '@/env'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import fastify from 'fastify'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

// secret é justamente a palavra-chave única do backend, então ela não deve ficar explicitamente no código
// para aplicações que o usuário ficará sempre logado é interessante deixar um curto período de expiração do token que ficará visível para o front-end, caso o 2º token ainda exista então um novo token visível será criado, assim o usuário nunca perde o login
// o signed indica se a informação passou pelo processo de HASHING
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    // 400 é o status comumente utilizado para erro de validação
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })

    if (env.NODE_ENV !== 'production') {
      console.error(error)
    } else {
      // No ambiente de produção o acompanhamento dos erros não será via console
      // TODO: Here we should log to an external tool
    }

    return reply.status(500).send({ message: 'Internal server error.' })
  }
})
