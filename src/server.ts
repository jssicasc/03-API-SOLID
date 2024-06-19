import { env } from './env'
import { app } from './app'

app
  .listen({
    host: '0.0.0.0', // No fastify o host definido desse modo faz com q a aplicação possa ser ACESSÍVEL por frontends (evitará problemas ao fazer a conexão com o front)
    port: env.PORT,
  })
  .then(() => {
    console.log(' HTTP SERVER IS ON BABY 🔥! iupiiupi 👽')
  })
