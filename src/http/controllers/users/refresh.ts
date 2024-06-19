import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) // verifica se o usuário está autenticado MAS NÃO Analisa o CABEÇALHO (Authorization Bearer token), a conferência é feita APENAS Nos Cookies

  const { role } = request.user

  // Lembrando-Que as informações ficam disponíveis em request.user.sub quando o jwtVerify é Sucesso
  const token = await reply.jwtSign(
    { role },
    {
      sign: { sub: request.user.sub },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
    .send({ token })
}
