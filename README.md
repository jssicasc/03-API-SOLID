# App

GymPass style app


## RFs (Requisitos Funcionais = O que é possível o usuário fazer na aplicação {funcionalidades})

- Deve ser possível se cadastrar;
- Deve ser possível se autenticar;
- Deve ser possível obter o perfil do um usuário logado;
- Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- Deve ser possível o usuário obter o seu histórico de check-ins;
- Deve ser possível o usuário buscar academias próximas;
- Deve ser possível o usuário buscar academias pelo nome;
- Deve ser possível o usuário realizar check-in em uma academia; (funcionalidade CORE = núcleo)
- Deve ser possível validar o check-in de um usuário;
- Deve ser possível cadastrar uma academia.


## RNs (Regras de Negócio = Caminhos que cada requisito pode tomar = CONDIÇÕES Aplicadas nas funcionalidades, logo a RN está Sempre ASSOCIADA ao RF {são os caminhos da aplicação} = Deve contar coisas imprescindíveis que a aplicação deve se preocupar)

- O usuário não deve poder se cadastrar com um e-mail duplicado;
- O usuário não pode fazer 2 check-ins no mesmo dia;
- O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- O check-in só pode ser validado até 20 minutos após ser criado;
- O check-in só pode ser validado por administradores;
- A academia só pode ser cadastrada por administradores;


## RNFs (Requisitos Não-Funcionais - NÃO Partem do usuário, são muito mais TÉCNICOS)

- A senha do usuário precisa estar criptografada;
- Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- Todas listas de dados precisam estar paginadas com 20 itens por página;
- O usuário deve ser identificado por um JWT (JSON Web Token);