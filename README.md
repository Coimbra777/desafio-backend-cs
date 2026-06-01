# Desafio Técnico - API de Triagem de Atendimentos

API REST para cadastro de usuários e para criação e consulta de tickets.
Os tickets são classificados automaticamente por canal, prioridade e revisão manual, e permitem atualização de status.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker Compose
- Jest
- Supertest

## Passo a passo para rodar na sua máquina

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
- migrations com `prisma migrate deploy`

API disponível em:

```text
http://localhost:3000
```

Health check:

```bash
curl http://localhost:3000/health
```

## Testes

Para rodar os testes localmente:

```bash
docker compose up -d postgres
npm install
npm test
```

## Scripts úteis

- `npm run build`
- `npm start`
- `npm test`
- `npm run dev`

## Endpoints

### Health

- `GET /health`

### Users

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

### Tickets

- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `PUT /tickets/:id/status`

## Regras de classificação

- `ouvidoria` => prioridade `alta`
- `sac` => prioridade `baixa`
- `suporte_tecnico` => prioridade `media`
- `financeiro` => prioridade `media`
- `fora_do_escopo` => prioridade `baixa` e `requiresManualReview: true`

## Arquivos úteis

- [requests.http](./requests.http): exemplos de requisições
- [postman/contato-seguro-api.postman_collection.json](./postman/contato-seguro-api.postman_collection.json): collection Postman
- [docs/ai-classification-prompt.md](./docs/ai-classification-prompt.md): sugestão de evolução futura com IA
