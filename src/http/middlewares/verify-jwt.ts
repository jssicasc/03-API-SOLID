import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log(request.headers)
    // jwtVerify é responsável por verificar se o token está contido no cabeçalho, caso exista então vai VALIDAR Se ele foi realmente gerado pela aplicação
    await request.jwtVerify()
    // se o token NÃO Existir então dará erro e as demais linhas não serão executada
    // ser der sucesso então os dados já ficam automaticamente disponíveis dentro de request.user lol
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
