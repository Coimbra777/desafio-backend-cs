# Desafio Técnico Back-end - API de Triagem de Atendimentos

API para triagem de atendimentos, com usuários, tickets, classificação automática de canal, prioridade e atualização de status.

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker Compose
- Jest
- Supertest

## Requisitos

Para rodar o projeto localmente, você precisa ter instalado:

- Node.js
- npm
- Docker
- Docker Compose

## Configuração de ambiente

1. Copie o arquivo `.env.example` para `.env`.
2. Revise os valores das variáveis de ambiente.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/contato_seguro_db?schema=public"
PORT=3000
```

### Variáveis

- `DATABASE_URL`: string de conexão do PostgreSQL usada pelo Prisma.
- `PORT`: porta em que a API será executada localmente.

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Suba o PostgreSQL com Docker:

```bash
docker compose up -d
```

3. Aplique as migrations no banco:

```bash
npx prisma migrate dev
```

4. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## Como rodar os testes

1. Suba o PostgreSQL:

```bash
docker compose up -d
```

2. Execute os testes:

```bash
npm test
```

## Scripts disponíveis

- `npm run dev`: inicia a aplicação em desenvolvimento com `ts-node-dev`.
- `npm run build`: compila o projeto TypeScript para a pasta `dist`.
- `npm start`: executa a versão compilada da aplicação.
- `npm test`: sincroniza o schema no banco de teste local e executa os testes com Jest.

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
- `PUT /tickets/:id`
- `PUT /tickets/:id/status`
- `DELETE /tickets/:id`

## Exemplos de requisição

### Criar usuário

```http
POST /users
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@example.com"
}
```

### Criar ticket

```http
POST /tickets
Content-Type: application/json

{
  "description": "Estou com erro de acesso ao sistema",
  "userId": 1
}
```

### Atualizar status do ticket

```http
PUT /tickets/1/status
Content-Type: application/json

{
  "status": "in_progress"
}
```

Existe também o arquivo [requests.http](./requests.http) com exemplos prontos para testar a API.

Também foi adicionada a collection Postman em [postman/contato-seguro-api.postman_collection.json](./postman/contato-seguro-api.postman_collection.json).
Para usar, abra o Postman, clique em `Import`, selecione o arquivo da collection e execute as requisições usando as variáveis `baseUrl`, `userId` e `ticketId`.

## Regras de classificação dos tickets

As classificações são feitas automaticamente com base em palavras-chave na descrição:

- `ouvidoria`: denúncia, assédio, fraude, corrupção, ética, conduta => prioridade `alta`
- `sac`: assinatura, cancelamento, atendimento, produto, entrega, reclamação => prioridade `baixa`
- `suporte_tecnico`: erro, acesso, bug, sistema, falha, indisponibilidade, login, senha => prioridade `media`
- `financeiro`: cobrança, pagamento, reembolso, boleto, nota fiscal, fatura => prioridade `media`
- `fora_do_escopo`: texto vazio, curto ou sem palavras reconhecidas => prioridade `baixa` e `requiresManualReview: true`

## Estrutura de pastas

```text
src/
  controllers/
  services/
  repositories/
  routes/
  utils/
  errors/
  middlewares/
prisma/
postman/
tests/
```

## Decisões técnicas

- Uso de camadas simples para separar responsabilidades entre rota, controller, service e repository.
- Uso de IDs numéricos para simplificar o desafio e facilitar leitura e testes.
- Classificação por regras determinísticas para manter previsibilidade e facilitar validação automatizada.
- `AppError` centralizado para padronizar o tratamento de erros esperados.
- `Supertest` para validar os endpoints HTTP de forma integrada.
- Logs estruturados simples em JSON no console, sem dependências extras.

## Observação sobre IA

Neste desafio, a classificação dos tickets foi implementada com regras determinísticas baseadas em palavras-chave. Essa abordagem foi escolhida por ser simples, previsível e fácil de testar.

Como evolução, essa etapa poderia ser substituída por IA usando um prompt estruturado que recebesse a descrição do ticket e retornasse um JSON com `channel` e `priority`. Isso permitiria lidar melhor com variações de linguagem e contextos mais complexos, mantendo uma saída padronizada para a API.

O projeto também inclui [docs/ai-classification-prompt.md](./docs/ai-classification-prompt.md) com uma sugestão de prompt para essa evolução futura.
