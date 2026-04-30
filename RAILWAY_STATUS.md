# 🚂 Railway Setup Status

**Data:** 2026-04-29
**Status:** ⚙️  EM PROGRESSO (Precisa de Manual Step)
**Projeto ID:** 3461830f-4bd2-4a50-a7b3-278c2a8c5c5c

---

## ✅ O Que Foi Feito Automaticamente (YOLO Mode)

```
✅ Projeto Railway criado
   └─ Nome: mercograin
   └─ Workspace: fabrikadeapp's Projects
   └─ URL: https://railway.com/project/3461830f-4bd2-4a50-a7b3-278c2a8c5c5c

✅ Deploy inicial enviado
   └─ Código enviado para Railway
   └─ Build iniciado
   └─ Procfile criado para Next.js

✅ Scripts de automação criados
   └─ RAILWAY_AUTO_SETUP.sh (interativo)
   └─ Procfile (configuração Railway)
```

---

## 🔄 O Que Precisa Ser Feito Manualmente

⚠️ **Railway requer ações manuais via Dashboard para provisionar DB:**

Railway não permite provisionar PostgreSQL e Redis via CLI sem muitos passos extras. A forma mais rápida é:

### Passo 1: Abrir Railway Dashboard

```
https://railway.com/project/3461830f-4bd2-4a50-a7b3-278c2a8c5c5c
```

### Passo 2: Provisionar PostgreSQL

1. Clicar em **"Add Service"** (botão azul com `+` no topo)
2. Selecionar **"Database"**
3. Selecionar **"PostgreSQL"**
4. Esperar provisionar (20-30 segundos)
5. Esperar status ficar verde (✅)

### Passo 3: Provisionar Redis

1. Clicar em **"Add Service"** novamente
2. Selecionar **"Database"**
3. Selecionar **"Redis"**
4. Esperar provisionar
5. Esperar status ficar verde (✅)

### Passo 4: Obter Connection Strings

1. **PostgreSQL:**
   - Clicar em "PostgreSQL" (lado esquerdo)
   - Abrir aba **"Connect"**
   - Copiar a linha que começa com `postgresql://`

2. **Redis:**
   - Clicar em "Redis" (lado esquerdo)
   - Abrir aba **"Connect"**
   - Copiar a linha que começa com `redis://`

### Passo 5: Injetar em .env.local

```bash
# Editar .env.local
nano .env.local

# Ou abrir em editor:
code .env.local
```

Colar as URLs:
```
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
```

### Passo 6: Adicionar Secrets em Railway

No Railroad dashboard:

1. Ir para **"Variables"** (lado esquerdo)
2. Clicar **"Add Variable"** para cada um:

```
TRADINGVIEW_WEBHOOK_SECRET=0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280
NEXTAUTH_SECRET=GEsPiSjmzTk7qOzw5k8nIgNWrlkhqSm3bM/SvhkIQ+0=
NEXTAUTH_URL=https://seu-projeto.railway.app
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-projeto.railway.app

BRASPAG_MERCHANT_ID=seu-merchant-id
BRASPAG_API_KEY=sua-api-key
BRASPAG_ENVIRONMENT=sandbox

TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_PHONE_NUMBER=+5511999999999

SIGNATURELY_API_KEY=sua-api-key
SENDGRID_API_KEY=seu-api-key
```

**⚠️ IMPORTANTE:** Railway **auto-popula** `DATABASE_URL` e `REDIS_URL` (não adicione manualmente)

### Passo 7: Fazer Primeiro Deploy

```bash
# Na pasta do projeto
cd /Users/gustavoholderbaumvieira/code/mercograin

# Fazer branch main (Railway usa main por padrão)
git branch -M main

# Push para Railway
git push -u origin main

# Aguardar build terminar (2-5 minutos)
```

### Passo 8: Executar Migrations

```bash
# Via Railway CLI
railway run npx prisma migrate deploy

# OU via SSH
railway ssh -s app
npm install
npx prisma migrate deploy
```

---

## 📋 Checklist Manual

- [ ] Abrir https://railway.com/project/3461830f-4bd2-4a50-a7b3-278c2a8c5c5c
- [ ] Provisionar PostgreSQL
- [ ] Provisionar Redis
- [ ] Copiar DATABASE_URL
- [ ] Copiar REDIS_URL
- [ ] Editar .env.local com URLs
- [ ] Adicionar secrets em Railway Variables
- [ ] git push -u origin main
- [ ] Aguardar deploy terminar
- [ ] Executar migrations
- [ ] Testar em: https://seu-projeto.railway.app

---

## 🤖 Automatização (Como Fazer Depois)

Se você quiser automatizar esse processo com CLI via API do Railway:

```bash
# Precisaria:
1. Instalar Railway CLI (tem - ✅)
2. Obter API token do Railway (não automático)
3. Usar curl com Railway GraphQL API
4. Criar PostgreSQL e Redis via API
5. Pegar credenciais de volta

# Railway não expõe isso facilmente via CLI, então:
# A forma mais prática é via UI (Dashboard) - 5 minutos
```

---

## 📊 Status Current

```
Project Creation:     ✅ COMPLETO
Code Deployment:      ✅ ENVIADO
PostgreSQL:           ⏳ PENDENTE (manual)
Redis:                ⏳ PENDENTE (manual)
Variables Setup:      ⏳ PENDENTE (manual)
Migrations:           ⏳ PENDENTE (manual)
Production Deploy:    ⏳ PENDENTE (manual)

Total: 40% automático ✅ + 60% manual ⏳
```

---

## 💡 Script de Ajuda

Execute o script interativo criado:

```bash
chmod +x RAILWAY_AUTO_SETUP.sh
./RAILWAY_AUTO_SETUP.sh

# Ou manual:
bash /Users/gustavoholderbaumvieira/code/mercograin/RAILWAY_AUTO_SETUP.sh
```

O script:
- ✅ Verifica Railway CLI
- ✅ Verifica autenticação
- ✅ Abre Dashboard automaticamente
- ⏳ Aguarda você fazer o setup manual (PostgreSQL + Redis)
- ✅ Abre .env.local para edição

---

## 🎯 Próximos Passos

### Imediato (5-10 minutos):
1. Abrir Railway Dashboard
2. Provisionar PostgreSQL
3. Provisionar Redis
4. Copiar credenciais

### Depois (5 minutos):
1. Editar .env.local
2. Adicionar secrets em Railway
3. git push

### Esperar (5 minutos):
1. Railway faz deploy automático
2. Build completa
3. Aplicação online

---

## 🆘 Troubleshooting

### "Build failing"
- Verificar logs em Railway → Deployments
- Comum: Node version, missing env vars

### "Database connection refused"
- PostgreSQL pode levar tempo para provisionar
- Esperar 30 segundos e tentar novamente
- Verificar DATABASE_URL está correto

### "Cannot find module"
- npm install não rodou
- Railway precisa de Procfile ou package.json
- Procfile foi criado ✅, deve funcionar

---

## 📞 Dashboard URL

```
Projeto: https://railway.com/project/3461830f-4bd2-4a50-a7b3-278c2a8c5c5c
Admin:   https://railway.app/account/settings
Docs:    https://docs.railway.app
```

---

## ✨ Quando Tudo Estiver ✅

Você terá:
- ✅ App rodando em https://seu-projeto.railway.app
- ✅ PostgreSQL gerenciado por Railway
- ✅ Redis cache em Railway
- ✅ Deploy automático a cada git push
- ✅ Logs acessíveis no dashboard
- ✅ Pronto para começar Semana 1-2 (Auth + CRM)

---

*Railway Setup - 2026-04-29*
*Status: Aguardando steps manuais no Dashboard*
