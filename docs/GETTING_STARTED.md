# 🚀 Guia de Início Rápido - CRM Farmacêutico

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **Docker** e **Docker Compose**
- **PostgreSQL** (via Docker ou local)
- **Git**

## 🛠️ Configuração do Ambiente

### 1. Clone e Configure o Projeto

```bash
# Clone o repositório
git clone <seu-repositorio>
cd crm-pha

# Instale as dependências de todos os projetos
npm run install:all
```

### 2. Configure as Variáveis de Ambiente

```bash
# Backend - copie e edite o arquivo .env
cd backend
cp .env.example .env
# Edite as variáveis necessárias

# Frontend - copie e edite o arquivo .env.local
cd ../frontend
cp .env.local.example .env.local
# Edite as variáveis necessárias
```

### 3. Inicie o Banco de Dados

```bash
# Volte para a raiz do projeto
cd ..

# Inicie apenas o PostgreSQL e Redis
docker-compose up postgres redis -d

# Ou inicie todos os serviços
docker-compose up -d
```

### 4. Configure o Banco de Dados

```bash
cd backend

# Execute as migrações
npx prisma migrate deploy

# (Opcional) Seed dados de exemplo
npx prisma db seed
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento Local

```bash
# Na raiz do projeto
npm run dev

# Ou separadamente:
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

### Com Docker

```bash
# Build e start todos os serviços
docker-compose up --build

# Apenas build
docker-compose build

# Start em background
docker-compose up -d
```

## 📊 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Comandos Úteis

### Frontend
```bash
cd frontend
npm run build          # Build para produção
npm run lint           # Verificar código
npm run type-check     # Verificar tipos TypeScript
```

### Backend
```bash
cd backend
npm run build          # Build para produção
npm run start:dev      # Modo desenvolvimento
npm run start:prod     # Modo produção
npm run test           # Executar testes
```

### Prisma
```bash
cd backend
npx prisma studio      # Interface visual do banco
npx prisma generate    # Gerar cliente
npx prisma migrate dev # Nova migração
npx prisma db push     # Push schema para DB
```

### Docker
```bash
docker-compose logs backend   # Logs do backend
docker-compose logs frontend  # Logs do frontend
docker-compose down           # Parar todos os serviços
docker-compose down -v        # Parar e remover volumes
```

## 🧪 Testes

```bash
# Frontend
cd frontend
npm test              # Jest
npm run test:coverage # Com coverage

# Backend
cd backend
npm test              # Jest
npm run test:e2e      # Testes E2E
```

## 📚 Estrutura do Projeto

```
crm-pha/
├── 📁 frontend/          # Next.js App
│   ├── 📁 src/
│   │   ├── 📁 app/       # App Router
│   │   ├── 📁 components/
│   │   ├── 📁 lib/
│   │   └── 📁 types/
│   └── 📄 package.json
├── 📁 backend/           # NestJS API
│   ├── 📁 src/
│   │   ├── 📁 modules/
│   │   ├── 📁 common/
│   │   └── 📁 prisma/
│   ├── 📁 prisma/
│   └── 📄 package.json
├── 📁 shared/            # Tipos compartilhados
├── 📁 docker/            # Configs Docker
├── 📄 docker-compose.yml
├── 📄 Jenkinsfile
└── 📄 README.md
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   ```bash
   # Verifique se o PostgreSQL está rodando
   docker-compose ps
   
   # Reinicie o banco
   docker-compose restart postgres
   ```

2. **Erro no Prisma Client**
   ```bash
   cd backend
   npx prisma generate
   ```

3. **Portas ocupadas**
   ```bash
   # Verifique processos usando as portas
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

4. **Problemas com dependências**
   ```bash
   # Limpe cache e reinstale
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🚀 Deploy em Produção

### AWS com Jenkins

1. Configure as credenciais AWS no Jenkins
2. Configure os secrets necessários
3. Faça push para a branch `main`
4. O pipeline será executado automaticamente

### Variáveis de Ambiente - Produção

```bash
# Backend
DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/db"
JWT_SECRET="super-secret-key"
OPENAI_API_KEY="sk-..."
AWS_S3_BUCKET="crm-pharma-files-prod"

# Frontend
NEXT_PUBLIC_API_URL="https://api.crm-pharma.com"
NEXTAUTH_URL="https://crm-pharma.com"
```

## 📞 Suporte

- **Documentação**: [Wiki do Projeto]
- **Issues**: [GitHub Issues]
- **Chat**: [Slack #crm-pharma]

---

**Desenvolvido com ❤️ para o setor farmacêutico brasileiro**
