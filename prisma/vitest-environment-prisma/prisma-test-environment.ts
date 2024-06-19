import 'dotenv/config' // lembrando-que essa importação faz as environment variables ficarem disponíveis em process.env
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // lembrando que o PrismaClient Cria a Conexão com o BD

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  // searchParams é equivalente ao query params
  url.searchParams.set('schema', schema)

  return url.toString()
}

// Lembrando-Que este seria o arquivo principal na importação do pacote & o <Environment> define o TIPO
// o setup define o código que será executado ANTES de CADA ARQUIVO De testes
// já o teardown é o método que será executado APÓS a execução dos testes
export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // mais rápido que criar um BD do zero é criar um schema, ele garante o contexto isolado desejado para-cada suite de teste
    const schema = randomUUID()

    console.log(generateDatabaseURL(schema))

    process.env.DATABASE_URL = generateDatabaseURL(schema)

    // função responsável por executar no terminal o que foi passado dentro de seu argumento
    // utilizou o deploy e não o dev pq não é necessário fazer as conferências do que já está no banco com o que foi alterado, com o deploy todas as migrations são executadas
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // o executeRaw é responsável por executar operações que não sejam select, como a versão Safe apesar de não permitir operações maliciosas (como sql injection) tbm não permite apagar o BD, então é necessário usar o unsafe nesse caso
        // o CASCADE é responsável por apagar TODAS As informações que foram criadas junto com o schema (indice, chave primaria/estrangeira...)
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()

        console.log('Teardown')
      },
    }
  },
}
