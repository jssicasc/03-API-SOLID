import 'dotenv/config' // Realiza o carregamento das variáveis definidas no arquivo .env
import { z } from 'zod'

// Quando o dotenv carregar as variáveis ambiente tais valores ficarão disponíveis dentro de process.env que é um objeto, por isso o uso de z.object
const envShcema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

// o safeParse valida se o process.env tem exatamente as informações definidas no envShcema
const _env = envShcema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌Invalid variables environment 💔', _env.error.format())
  throw new Error('❌Invalid variables environment 💔') // Derruba a aplicação caso ocorra algum erro nas variáveis ambiente
}

// caso a validação tenha sido um sucesso então os dados das variáveis ambiente são exportados
export const env = _env.data
