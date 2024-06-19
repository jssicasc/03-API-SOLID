export class UserAlreadyExistsError extends Error {
  constructor() {
    // super() é o método construtor DA CLASSE ERROR
    super('E-mail already exists.')
  }
}
