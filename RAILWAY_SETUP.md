# 🚂 Railway Setup - YOLO Mode

**Tempo estimado:** 10-15 minutos

---

## 1️⃣ Criar Conta Railway (Se não tiver)

**URL:** https://railway.app

- Clicar "Sign Up"
- Login com GitHub
- Autorizar acesso ao seu GitHub

---

## 2️⃣ Conectar Repositório

**Em Railway Dashboard:**

1. Clicar **"New Project"**
2. Selecionar **"GitHub Repo"**
3. Buscar **"mercograin"**
4. Clicar **"Deploy Now"**

**Railway vai automaticamente:**
- ✅ Detectar Next.js
- ✅ Criar PostgreSQL
- ✅ Criar Redis
- ✅ Instalar dependências
- ✅ Fazer primeiro deploy (vai falhar por DB não estar conectada, é normal)

---

## 3️⃣ Obter Connection Strings

### PostgreSQL

1. No Railway dashboard, abra seu projeto
2. Clique em **"PostgreSQL"**
3. Abra aba **"Connect"**
4. Copie a linha que começa com `postgresql://`
5. Cole em `.env.local` na linha:
   ```
   DATABASE_URL="copie-aqui"
   ```

### Redis

1. No Railway dashboard, clique em **"Redis"**
2. Abra aba **"Connect"**
3. Copie a linha que começa com `redis://`
4. Cole em `.env.local` na linha:
   ```
   REDIS_URL="copie-aqui"
   ```

---

## 4️⃣ Adicionar Secrets em Railway

No Railway dashboard do seu projeto:

1. Clicar em **"Variables"** (lado esquerdo)
2. Clicar **"Add Variable"**
3. Adicionar cada uma:

```
TRADINGVIEW_WEBHOOK_SECRET=0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280
NEXTAUTH_SECRET=GEsPiSjmzTk7qOzw5k8nIgNWrlkhqSm3bM/SvhkIQ+0=
NEXTAUTH_URL=https://seu-app.railway.app
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-app.railway.app

BRASPAG_MERCHANT_ID=seu-merchant-id
BRASPAG_API_KEY=sua-api-key
BRASPAG_ENVIRONMENT=sandbox

TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_PHONE_NUMBER=+5511999999999

SIGNATURELY_API_KEY=sua-api-key
SENDGRID_API_KEY=seu-api-key
```

**⚠️ IMPORTANTE:** Railway auto-popula `DATABASE_URL` e `REDIS_URL` (não precisa adicionar)

---

## 5️⃣ Push para Railway

```bash
# Mudar branch para main (Railway usa main por padrão)
git branch -M main

# Adicionar remote Railway (se não estiver)
git remote add railway https://github.com/seu-usuario/mercograin.git

# Push para main
git push -u origin main
```

**Railway vai:**
- ✅ Detectar push
- ✅ Instalar dependências
- ✅ Executar migrations Prisma
- ✅ Deploy automático
- ✅ Gerar URL pública: `seu-app-name.railway.app`

---

## 6️⃣ Verificar Deploy

No Railway dashboard:

1. Clicar em **"Deployments"**
2. Ver status do build (deve estar verde)
3. Se ver erros, clicar em **"View Logs"**
4. Procurar por `listening on` ou URL pública

**Sua URL pública será:**
```
https://seu-projeto-xxxxx.railway.app
```

---

## ✅ Checklist Railway

- [ ] Conta Railway criada
- [ ] GitHub conectado
- [ ] Novo projeto criado
- [ ] PostgreSQL + Redis criados automaticamente
- [ ] Connection strings copiadas para .env.local
- [ ] Secrets adicionados em Railway Variables
- [ ] Push feito para main
- [ ] Deploy bem-sucedido (logs verdes)
- [ ] URL pública obtida

---

## 🐛 Troubleshooting Railway

### Deploy falha com "DATABASE_URL not found"
- Verificar se PostgreSQL foi criado
- Ir a Variables e confirmar DATABASE_URL está lá
- Railway auto-popula, mas às vezes demora

### Deploy falha com "NEXTAUTH_SECRET"
- Adicionar em Variables do Railway
- NUNCA colocar no .env.local de produção

### Logs mostram erro de conexão
- Esperar 30s (Railway às vezes demora para criar DB)
- Fazer novo push: `git commit --allow-empty -m "trigger rebuild" && git push`

### Aplicação roda localmente mas não em Railway
- Verificar logs em Railway Deployments
- Procurar por mensagens de erro específicas
- Comum: portas, variáveis de ambiente

---

## 📡 Próximo: TradingView Webhooks

Quando Railway estiver ✅, configure webhooks em TradingView:

```
URL: https://seu-app-xxxxx.railway.app/api/webhooks/tradingview
Header: x-tradingview-secret: 0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280
```

---

*Railway Setup Completo!*
