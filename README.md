# 📝 Bloco de Notas Online

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

Uma aplicação web full-stack para gerenciamento de notas pessoais, desenvolvida com Node.js, Express, EJS e MySQL. Permite aos usuários criar, editar, visualizar e excluir anotações de forma segura, com sistema de autenticação baseado em JWT e controle de acesso por usuário.

## ✨ Funcionalidades

### 👤 Sistema de Usuários
- ✅ Cadastro de novos usuários com validação
- ✅ Login seguro com JWT (JSON Web Tokens)
- ✅ Controle de acesso às notas (apenas usuário logado)
- ✅ Logout e gerenciamento de sessões

### 📝 Sistema de Notas (CRUD Completo)
- ✅ Criar novas notas com título e conteúdo
- ✅ Visualizar lista de notas do usuário
- ✅ Editar notas existentes
- ✅ Excluir notas
- ✅ Armazenamento persistente em banco de dados MySQL
- ✅ Interface responsiva e intuitiva

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js com Express.js
- **Frontend**: EJS (Embedded JavaScript Templates) + CSS3
- **Banco de Dados**: MySQL 8.0+
- **Autenticação**: JWT (jsonwebtoken) + bcryptjs para hash de senhas
- **Containerização**: Docker + Docker Compose
- **Outros**: cookie-parser, method-override

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## 🛠️ Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/sistema-de-bloco-de-notas.git
   cd sistema-de-bloco-de-notas
   ```

2. **Suba os contêineres:**
   ```bash
   docker compose up --build
   ```

   - A aplicação ficará disponível em `http://localhost:3000`
   - O MySQL roda em um contêiner separado na porta 3306
   - O banco é inicializado automaticamente com o arquivo `db.sql`
   - As credenciais estão definidas diretamente em [docker-compose.yml](/home/roberto/Documents/GitHub/sistema-de-bloco-de-notas/docker-compose.yml)

3. **Para parar os contêineres:**
   ```bash
   docker compose down
   ```

4. **Para limpar volumes e recriar tudo:**
   ```bash
   docker compose down -v
   ```

## 📖 Como Usar

1. **Acesse a aplicação** no navegador: `http://localhost:3000`

2. **Cadastre-se** como novo usuário ou faça login se já tiver uma conta

3. **Gerencie suas notas:**
   - Clique em "Criar Nota" para adicionar uma nova anotação
   - Visualize suas notas na página principal
   - Edite ou exclua notas clicando nos botões correspondentes

## 📁 Estrutura do Projeto

```
sistema-de-bloco-de-notas/
├── app.js                 # Arquivo principal da aplicação
├── db.js                  # Configuração da conexão com MySQL
├── db.sql                 # Script de criação do banco de dados
├── package.json           # Dependências e scripts
├── Dockerfile             # Configuração do contêiner da aplicação
├── docker-compose.yml     # Orquestração dos serviços
├── .dockerignore          # Arquivos ignorados no build Docker
├── routes/
│   ├── routerAuth.js      # Rotas de autenticação
│   ├── routerIndex.js     # Rota da página inicial
│   └── routerNotes.js     # Rotas de gerenciamento de notas
├── views/                 # Templates EJS
│   ├── index.ejs
│   ├── note.ejs
│   ├── notes.ejs
│   ├── notesCreate.ejs
│   ├── notesEdit.ejs
│   ├── userLogin.ejs
│   ├── userRegister.ejs
│   └── partials/
│       └── header.ejs
└── public/                # Arquivos estáticos
    ├── css/
    │   ├── header.css
    │   ├── index.css
    │   ├── note.css
    │   ├── notes.css
    │   ├── notesCreate.css
    │   ├── notesEdit.css
    │   ├── userLogin.css
    │   └── userRegister.css
    └── js/
        └── notes.js
```

## 🔧 Scripts Disponíveis

- `npm start`: Inicia a aplicação em modo produção
- `npm run dev`: Inicia a aplicação em modo desenvolvimento (com nodemon)
- `npm test`: Executa testes (atualmente não implementados)

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
