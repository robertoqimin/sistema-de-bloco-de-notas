# Bloco de Notas Online

Aplicacao web para gerenciamento de notas pessoais com autenticacao de usuarios, interface em EJS e persistencia em MySQL.

## Funcionalidades

- Cadastro e login de usuarios
- Autenticacao com JWT
- CRUD completo de notas
- Persistencia em MySQL
- Execucao com Docker Compose

## Tecnologias

- Node.js
- Express
- EJS
- MySQL 8
- Docker Compose

## Requisitos

- Docker
- Docker Compose

## Como executar

1. Clone o repositorio:

```bash
git clone https://github.com/seu-usuario/sistema-de-bloco-de-notas.git
cd sistema-de-bloco-de-notas
```

2. Suba os containers:

```bash
docker compose up --build
```

3. Acesse:

```text
http://localhost:3000
```

## Comandos uteis

Subir os containers:

```bash
docker compose up --build
```

Parar os containers:

```bash
docker compose down
```

Apagar volumes e recriar o banco:

```bash
docker compose down -v
```

Ver logs:

```bash
docker compose logs -f
```

## Banco de dados

- O banco `dbnotas` e criado automaticamente pelo container MySQL.
- O script [db.sql](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/db.sql) e executado na inicializacao do banco.
- A aplicacao conecta usando o host `db`, que e o nome do servico no Docker Compose.

## Estrutura

- [app.js](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/app.js): inicializacao da aplicacao
- [db.js](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/db.js): conexao com MySQL
- [docker-compose.yml](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/docker-compose.yml): servicos da aplicacao e do banco
- [db.sql](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/db.sql): criacao das tabelas
- [routes/routerAuth.js](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/routes/routerAuth.js): autenticacao
- [routes/routerNotes.js](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/routes/routerNotes.js): notas

## Observacoes

- O projeto esta configurado para uso via Docker.
- As variaveis de ambiente estao definidas diretamente em [docker-compose.yml](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/docker-compose.yml).
- O arquivo `.env` nao e mais obrigatorio para executar o projeto.
- Se houver erro com dados antigos do MySQL, rode `docker compose down -v` antes de subir novamente.
