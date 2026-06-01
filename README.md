# API de Triagem de Atendimentos

API REST para cadastro de usuários e para criação, consulta e atualização de status de tickets.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker Compose
- Jest
- Supertest

Requisitos:

Ter git e docker instalados

Clone o projeto:

```bash
git clone git@github.com:Coimbra777/desafio-backend-cs.git
```

Depois acesse:

```bash
cd desafio-backend-cs/
```

## Variáveis de ambiente

Copie o arquivo de exemplo para `.env`:

```bash
cp .env.example .env
```

O Docker Compose lê o `.env` automaticamente na raiz do projeto.
`DATABASE_URL` usa `postgres:5432` porque a API roda dentro do Docker e acessa o banco pelo nome do serviço.
`POSTGRES_PORT` expõe o PostgreSQL para a máquina local, mantendo a porta `5433` fora do container.

## Como rodar com Docker

Modo oficial de execução:

```bash
docker compose up --build
```

Esse comando sobe:

- API
- PostgreSQL
- migrations com `prisma migrate deploy`API disponível em `http://localhost:3000`

Health check:

```text
GET /health
```

O Docker Compose lê o arquivo `.env` automaticamente. A `DATABASE_URL` usa `postgres:5432` porque a API roda dentro do Docker, e `POSTGRES_PORT` expõe o banco para a máquina local.

## Como rodar os testes

```bash
docker compose up -d postgres
npm install
npm test
```

## Endpoints

- `GET /health`
- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `PUT /tickets/:id/status`

## Regras de classificação dos tickets

- `ouvidoria`
- `sac`
- `suporte_tecnico`
- `financeiro`
- `fora_do_escopo`

Tickets classificados como `fora_do_escopo` recebem `requiresManualReview: true`.

## Exemplos de requisição

Criar usuário:

```http
POST /users
Content-Type: application/json

{
  "name": "Teste",
  "email": "teste@gmail.com"
}
```

Criar ticket:

```http
POST /tickets
Content-Type: application/json

{
  "description": "Estou com erro de acesso ao sistema"
}
```

Atualizar status do ticket:

```http
PUT /tickets/1/status
Content-Type: application/json

{
  "status": "in_progress"
}
```

## Como parar a aplicação

```bash
docker compose down -v
```

## Arquivos úteis

- [requests.http](./requests.http)
- [postman/contato-seguro-api.postman_collection.json](./postman/contato-seguro-api.postman_collection.json)
- [docs/ai-classification-prompt.md](./docs/ai-classification-prompt.md)
