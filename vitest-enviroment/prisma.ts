import { Environment } from 'vitest'

// Lembrando-Que este seria o arquivo principal na importação do pacote & o <Environment> define o TIPO
// o setup define o código que será executado ANTES de CADA ARQUIVO De testes
// já o teardown é o método que será executado APÓS a execução dos testes
export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    await console.log('Executando Environment lol')

    return {
      async teardown() {
        await console.log('Teardown')
      },
    }
  },
}
