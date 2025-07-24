# Oportunidades API

Uma API REST para gerenciamento de oportunidades acadêmicas e extracurriculares na universidade.

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL (via Sequelize)
- JWT para autenticação
- bcrypt para hashing de senha
- nodemailer para notificações por e‑mail
- express-validator para validações
- winston para logging
- node-cron para agendamento de backups

## 📋 Pré-requisitos

- Node.js (v14+)
- npm ou yarn
- PostgreSQL rodando localmente
- Conta de e‑mail SMTP (ex.: Gmail com senha de app)

## 🔧 Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/oportunidades-api.git
   cd oportunidades-api
   ```

2. Instale dependências:

   ```bash
   npm install
   ```

## ⚙️ Configuração

1. Crie o arquivo `.env` na raiz com as variáveis:

   ```dotenv
   # Banco de dados
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=oportunidades_db
   DB_USER=postgres
   DB_PASS=secret

   # Autenticação JWT
   JWT_SECRET=sua_chave_secreta

   # SMTP (Gmail como exemplo)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seuemail@gmail.com
   EMAIL_PASS=sua_senha_de_app

   # Backup
   BACKUP_PATH=./backups
   ```

2. (Opcional) Crie o banco no PostgreSQL:

   ```sql
   CREATE DATABASE oportunidades_db;
   ```

3. Rode as migrações (ou `sync`) para criar tabelas:

   ```bash
   npm run migrate    # se usar Sequelize-CLI
   # ou em dev: sequelize.sync({ alter: true }) via models/index.js
   ```

## 🚀 Executando

- Modo desenvolvimento (com recarga automática):

  ```bash
  npm run dev
  ```

- Produção:

  ```bash
  npm start
  ```

O servidor estará disponível em `http://localhost:3000` por padrão.

## 🗂️ Scripts úteis

| Script           | Descrição                        |
| ---------------- | -------------------------------- |
| `npm start`      | Inicia o servidor em modo normal |
| `npm run dev`    | Inicia com nodemon (reload)      |
| `npm run backup` | Executa o script de backup       |
|                  |                                  |

## 📚 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Rota        | Descrição                     | Body obrigatório                  |
| ------ | ----------- | ----------------------------- | --------------------------------- |
| POST   | `/register` | Cadastra novo usuário         | `{ name, email, password, role }` |
| POST   | `/login`    | Autentica e retorna token JWT | `{ email, password }`             |

### Usuários (`/api/users`)

> **Cabeçalho:** `Authorization: Bearer <token>`

| Método | Rota                | Descrição                              | Body opcional                               |            |
| ------ | ------------------- | -------------------------------------- | ------------------------------------------- | ---------- |
| GET    | `/me`               | Retorna perfil do usuário autenticado  | —                                           |            |
| PUT    | `/me`               | Atualiza dados básicos do perfil       | `{ name?, course?, semester?, interests? }` |            |
| PUT    | `/me/notifications` | Ativa/desativa notificações por e‑mail | \`{ emailNotifications: true                |  false }\` |

### Oportunidades (`/api/opportunities`)

> **Cabeçalho:** `Authorization: Bearer <token>`

| Método | Rota            | Descrição                                   | Query / Body                                                  |
| ------ | --------------- | ------------------------------------------- | ------------------------------------------------------------- |
| GET    | `/`             | Lista oportunidades (filtros, busca, ordem) | `?search=&type=&area=&sort=field_dir`                         |
| POST   | `/`             | Cria oportunidade (prof./coord.)            | `{ title, type, description, area, publishDate?, deadline? }` |
| GET    | `/favorites`    | Lista favoritos do usuário                  | —                                                             |
| GET    | `/:id`          | Detalha oportunidade por ID                 | —                                                             |
| PUT    | `/:id`          | Atualiza (só criador)                       | `{ title?, description?, area?, deadline? }`                  |
| DELETE | `/:id`          | Remove oportunidade (só criador)            | —                                                             |
| POST   | `/:id/favorite` | Adiciona aos favoritos                      | —                                                             |
| DELETE | `/:id/favorite` | Remove dos favoritos                        | —                                                             |

## 📦 Backup Diário

O `node-cron` agenda execução diária às 02:00 h:

```bash
npm run backup
```

Mantém os últimos 7 backups no `BACKUP_PATH`.

---

**Desenvolvido por Emanuel Abreu**
