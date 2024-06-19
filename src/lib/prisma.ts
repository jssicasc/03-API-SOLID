import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

// Para criar a conexão com o BD basta instanciar este PrismaClient
// É possível passar um objeto de configurações para o PrismaClient, com isso em desenvolvimento exibe o log com as querys executadas pelo prisma
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
