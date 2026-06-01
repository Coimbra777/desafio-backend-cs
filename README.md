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

## Pré-requisitos

Ter `git` e `docker` instalados.

Clone o projeto:

```bash
git clone git@github.com:Coimbra777/desafio-backend-cs.git
cd desafio-backend-cs/
```

## Variáveis de ambiente

Copie o arquivo de exemplo para `.env`:

```bash
cp .env.example .env
```

O Docker Compose lê o `.env` automaticamente na raiz do projeto.

- `DATABASE_URL` usa `postgres:5432` porque a API roda dentro do Docker e acessa o banco pelo nome do serviço.
- `POSTGRES_PORT` expõe o PostgreSQL para a máquina local, mantendo a porta `5433` fora do container.

## Como rodar com Docker

Modo oficial de execução:

```bash
docker compose up --build
```

Esse comando sobe:

- API
- PostgreSQL
- migrations com `prisma migrate deploy`

API disponível em `http://localhost:3000`.

Health check:

```text
GET /health
```

Para verificar se os containers subiram:

```bash
docker ps
```

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

## Contratos da API

Valores permitidos hoje:

- `status`: `open`, `in_progress`, `closed`
- `channel`: `ouvidoria`, `sac`, `suporte_tecnico`, `financeiro`, `fora_do_escopo`
- `priority`: `alta`, `media`, `baixa`

## Regra de classificação automática

A classificação atual é determinística e baseada em palavras-chave encontradas na descrição do ticket.

- termos como `denuncia` e `assedio` direcionam para `ouvidoria`
- termos como `erro`, `acesso` e `sistema` direcionam para `suporte_tecnico`
- termos como `reembolso` e `cobranca` direcionam para `financeiro`
- textos não reconhecidos caem em `fora_do_escopo`

Tickets classificados como `fora_do_escopo` recebem `requiresManualReview: true`.

Essa regra é simples de propósito para o desafio técnico. Futuramente ela pode ser substituída por uma abordagem com IA/NLP sem alterar os contratos principais da API.

## Exemplos de requisição e resposta

### Criação de usuário

Requisição:

```http
POST /users
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@example.com"
}
```

Resposta:

```json
{
  "id": 1,
  "name": "Maria Silva",
  "email": "maria@example.com",
  "createdAt": "2026-06-01T12:00:00.000Z",
  "updatedAt": "2026-06-01T12:00:00.000Z"
}
```

### Criação de ticket

Requisição:

```http
POST /tickets
Content-Type: application/json

{
  "description": "Estou com erro de acesso ao sistema",
  "userId": 1
}
```

Resposta:

```json
{
  "id": 1,
  "description": "Estou com erro de acesso ao sistema",
  "channel": "suporte_tecnico",
  "priority": "media",
  "status": "open",
  "requiresManualReview": false,
  "userId": 1,
  "createdAt": "2026-06-01T12:05:00.000Z",
  "updatedAt": "2026-06-01T12:05:00.000Z",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@example.com"
  }
}
```

### Atualização de status do ticket

Requisição:

```http
PUT /tickets/1/status
Content-Type: application/json

{
  "status": "in_progress"
}
```

Resposta:

```json
{
  "id": 1,
  "description": "Estou com erro de acesso ao sistema",
  "channel": "suporte_tecnico",
  "priority": "media",
  "status": "in_progress",
  "requiresManualReview": false,
  "userId": 1,
  "createdAt": "2026-06-01T12:05:00.000Z",
  "updatedAt": "2026-06-01T12:10:00.000Z",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@example.com"
  }
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
