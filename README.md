# Bloco de Notas Online

Aplicacao web para cadastro de usuarios e gerenciamento de notas pessoais. O projeto usa Node.js com Express, renderizacao em EJS, autenticacao com JWT em cookie HTTP-only e persistencia em MySQL.

## Funcionalidades

- Cadastro e login de usuarios
- Logout com limpeza do cookie de autenticacao
- CRUD completo de notas
- Isolamento das notas por usuario autenticado
- Validacoes basicas de formulario no backend
- Protecao de rotas autenticadas e verificacao de mesma origem para requisicoes `POST`
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

## Pre-requisitos

### Com Docker

- Docker
- Docker Compose

### Sem Docker

- Node.js 20+
- MySQL 8+

## Variaveis de ambiente

`JWT_SECRET` e obrigatoria. As demais possuem valor padrao no projeto.

Exemplo para execucao local:

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

Defaults usados em `db.js`:

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

A aplicacao fica disponivel em `http://localhost:3000`.

Os servicos definidos hoje sao:

- `app`: aplica o `Dockerfile`, expoe a porta `3000` e injeta as variaveis da aplicacao
- `db`: usa a imagem `mysql:8.4`, cria o banco `dbnotas` e executa o script `db.sql` na inicializacao

O `app` depende do `healthcheck` do MySQL, e o backend tambem tenta reconectar automaticamente ao banco em caso de falha inicial.

### Execucao local

1. Instale as dependencias:

```bash
npm install
```

2. Garanta que o MySQL esteja em execucao e que o banco/usuario estejam configurados para os valores do seu ambiente.

3. Execute o script SQL inicial:

```bash
mysql -u root -p < db.sql
```

4. Inicie a aplicacao:

```bash
npm run dev
```

Ou, para execucao sem `nodemon`:

```bash
npm start
```

## Banco de dados

O arquivo `db.sql` cria:

- banco `dbnotas`
- tabela `users`
- tabela `notes`, relacionada ao usuario dono da nota

## Rotas principais

### Publicas

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

## Scripts disponiveis

```bash
npm start
npm run dev
npm test
```

Observacao: o script `npm test` ainda nao possui testes implementados e retorna erro por padrao.

## Comandos uteis com Docker

```bash
docker compose up --build
docker compose down
docker compose down -v
docker compose logs -f app
docker compose logs -f db
docker compose ps
```
