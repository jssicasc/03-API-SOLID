import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    // o 1º arg são para os dados de PAYLOAD EXCETO o id do usuário, que deve ser passado no 2º arg
    // E JAMAIS Coloque qualquer informação SIGILOSA do usuário dentro do JWT (como a senha), pois o payload NÃO É Criptografado, ele possui apenas uma simples codificação
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: { sub: user.id },
      },
    )

    // o usuário só perderá a autenticação na aplicação se ficar 7 dias SEM ENTRAR na aplicação
    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    // lembrando que o path indica quais rotas da aplicação vão ter acesso ao cookie
    // !IMPORTANTE! secure: true -> define que o cookie será encriptado pelo https; sameSite: true -> define que só é acessível DENTRO DO MESMO DOMÍNIO;
    // httpOnly: true -> define que o cookie só é acessível DENTRO Do backend via requisição e resposta (não fica salvo no browser)
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token }) // Lembrando-Que 200 simboliza sucesso
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message }) // Bad request sinaliza que alguma informação foi introduzida de modo incorreto
    }

    throw err
  }
}
