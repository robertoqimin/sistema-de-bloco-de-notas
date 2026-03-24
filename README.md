# Bloco de Notas Online

Aplicação web para cadastro de usuários e gerenciamento de notas pessoais. O projeto usa Node.js com Express, renderização em EJS, autenticação com JWT em cookie HTTP-only e persistência em MySQL.

## Funcionalidades

- Cadastro e login de usuários
- Logout com limpeza do cookie de autenticação
- CRUD completo de notas
- Isolamento das notas por usuário autenticado
- Validações básicas de formulário no backend
- Proteção de rotas autenticadas e verificação de mesma origem para requisições `POST`
- Ambiente pronto para subir com Docker Compose

## Stack

- Node.js 20
- Express 5
- EJS
- MySQL 8.4
- `jsonwebtoken`
- `bcryptjs`
- Docker e Docker Compose

## Estrutura principal

```text
sistema-de-bloco-de-notas/
├── app.js
├── config.js
├── db.js
├── db.sql
├── Dockerfile
├── docker-compose.yml
├── middleware/
│   ├── auth.js
│   └── verifySameOrigin.js
├── routes/
│   ├── routerAuth.js
│   ├── routerIndex.js
│   └── routerNotes.js
├── views/
│   ├── index.ejs
│   ├── note.ejs
│   ├── notes.ejs
│   ├── notesCreate.ejs
│   ├── notesEdit.ejs
│   ├── userLogin.ejs
│   ├── userRegister.ejs
│   ├── partials/
│   └── public/
└── package.json
```

## Pré-requisitos

### Com Docker

- Docker
- Docker Compose

### Sem Docker

- Node.js 20+
- MySQL 8+

## Variáveis de ambiente

`JWT_SECRET` é obrigatória. As demais possuem valor padrão no projeto.

Exemplo para execução local:

```env
PORT=3000
JWT_SECRET=uma-chave-segura
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua-senha
DB_NAME=dbnotas
NODE_ENV=development
```

Valores padrão usados em `db.js`:

- `DB_HOST=db`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=` vazio
- `DB_NAME=dbnotas`

## Como executar

### Docker Compose

```bash
docker compose up --build
```

A aplicação fica disponível em `http://localhost:3000`.

Os serviços definidos hoje são:

- `app`: aplica o `Dockerfile`, expõe a porta `3000` e injeta as variáveis da aplicação
- `db`: usa a imagem `mysql:8.4`, cria o banco `dbnotas` e executa o script `db.sql` na inicialização

O `app` depende do `healthcheck` do MySQL, e o backend também tenta reconectar automaticamente ao banco em caso de falha inicial.

### Execução local

1. Instale as dependências:

```bash
npm install
```

2. Garanta que o MySQL esteja em execução e que o banco/usuário estejam configurados para os valores do seu ambiente.

3. Execute o script SQL inicial:

```bash
mysql -u root -p < db.sql
```

4. Inicie a aplicação:

```bash
npm run dev
```

Ou, para execução sem `nodemon`:

```bash
npm start
```

## Banco de dados

O arquivo `db.sql` cria:

- banco `dbnotas`
- tabela `users`
- tabela `notes`, relacionada ao usuário dono da nota

## Rotas principais

### Públicas

- `GET /`
- `GET /register`
- `POST /register`
- `GET /login`
- `POST /login`

### Autenticadas

- `POST /logout`
- `GET /notes`
- `GET /notes/list`
- `GET /notes/create`
- `POST /notes/create`
- `GET /notes/:id`
- `GET /notes/:id/edit`
- `POST /notes/:id/edit`
- `POST /notes/:id/delete`

## Scripts disponíveis

```bash
npm start
npm run dev
npm test
```

Observação: o script `npm test` ainda não possui testes implementados e retorna erro por padrão.

## Comandos úteis com Docker

```bash
docker compose up --build
docker compose down
docker compose down -v
docker compose logs -f app
docker compose logs -f db
docker compose ps
```
