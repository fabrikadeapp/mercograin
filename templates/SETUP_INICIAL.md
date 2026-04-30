# Setup Inicial - Passo a Passo

## ✅ Checklist Antes de Começar

### 1. Recursos Externos (Contas)

- [ ] **GitHub**
  - [ ] Criar conta se não tiver
  - [ ] Criar repositório `mercograin`
  - [ ] Clone localmente

- [ ] **Railway**
  - [ ] Criar conta (login com GitHub)
  - [ ] Conectar ao repositório GitHub
  - [ ] Provisionar PostgreSQL (automaticamente)
  - [ ] Provisionar Redis (automaticamente)

- [ ] **TradingView**
  - [ ] Você já assina ✅
  - [ ] Logar e acessar Alertas
  - [ ] Preparar para configurar webhooks (próximo passo)

- [ ] **Investing.com**
  - [ ] Nenhuma configuração necessária (scraping automático)

- [ ] **Braspag**
  - [ ] Criar conta em https://www.braspag.com.br
  - [ ] Obter MerchantId e API Key
  - [ ] Testar em ambiente sandbox

- [ ] **Twilio**
  - [ ] Criar conta em https://www.twilio.com
  - [ ] Gerar número Twilio
  - [ ] Ativar WhatsApp Business API
  - [ ] Obter Account SID, Auth Token

- [ ] **Signaturely**
  - [ ] Criar conta em https://www.signaturely.com (free tier)
  - [ ] Gerar API Key

- [ ] **SendGrid**
  - [ ] Criar conta em https://sendgrid.com (free tier)
  - [ ] Gerar API Key

---

## 🚀 Passo 1: Clonar e Configurar Localmente

### Pré-requisitos:
- Node.js 18+
- npm ou yarn
- Git
- PostgreSQL cliente (psql) - opcional

### Executar:

```bash
# 1. Clonar (já foi feito, está em /code/mercograin)
cd /Users/gustavoholderbaumvieira/code/mercograin

# 2. Instalar dependências
npm install

# 3. Copiar .env
cp .env.example .env.local

# 4. Gerar NEXTAUTH_SECRET
# No terminal:
openssl rand -base64 32
# Copiar saída e colar em .env.local NEXTAUTH_SECRET=<cola-aqui>

# 5. Editar .env.local com suas credenciais
# Abrir em editor:
# - DATABASE_URL (você vai pegar do Railway)
# - REDIS_URL (você vai pegar do Railway)
# - API keys (Braspag, Twilio, Signaturely, SendGrid)
# - TRADINGVIEW_WEBHOOK_SECRET (qualquer string aleatória)

# 6. Testar conexão (vai falhar se DB não estiver pronto, normal)
npm run type-check
```

---

## 🔗 Passo 2: Conectar Railway

### 2.1 Criar Projeto em Railway

1. Ir para https://railway.app
2. Logar com GitHub
3. Clicar em "New Project"
4. Selecionar seu repositório `mercograin`
5. Railway detectará automaticamente `package.json`

### 2.2 Provisionar Serviços

1. **PostgreSQL:**
   - No dashboard Railway, clicar "Add Services"
   - Selecionar "PostgreSQL"
   - Será provisionado automaticamente

2. **Redis:**
   - Clicar "Add Services" novamente
   - Selecionar "Redis"
   - Será provisionado automaticamente

### 2.3 Copiar Connection Strings

1. Abrir projeto em Railway dashboard
2. Clicar em "PostgreSQL" → "Connect"
3. Copiar "DATABASE_URL"
4. Colar em `.env.local` (já deve estar lá se Railroad fizer auto-bind)

5. Clicar em "Redis" → "Connect"
6. Copiar "REDIS_URL"
7. Colar em `.env.local`

### 2.4 Adicionar Variáveis Sensíveis

No Railway dashboard:
1. Ir para seu projeto
2. Clicar "Variables"
3. Adicionar cada uma (copiando de `.env.local`):
   - TRADINGVIEW_WEBHOOK_SECRET
   - NEXTAUTH_SECRET (novo valor para prod)
   - NEXTAUTH_URL=https://seu-dominio.railway.app
   - BRASPAG_MERCHANT_ID
   - BRASPAG_API_KEY
   - BRASPAG_ENVIRONMENT=sandbox
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_PHONE_NUMBER
   - SIGNATURELY_API_KEY
   - SENDGRID_API_KEY

### 2.5 Deploy Automático

1. Fazer push para `main`:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. Railway detectará e fará deploy automático
3. Ver logs em "Deployments"

---

## 🗄️ Passo 3: Criar Schema Banco de Dados

### Local (desenvolvimento):

```bash
# Isso vai rodar migrations e criar as tabelas
npx prisma migrate dev --name init
```

Se erro de conexão, verificar:
- DATABASE_URL está certo em `.env.local`
- PostgreSQL está rodando (Railway ou local)

### Railway (produção):

```bash
# Conectar ao banco Railway
# Opção 1: Via proxy Railway CLI
railway up

# Opção 2: Automático no deploy (Railway roda migrations no build)
```

---

## 🔐 Passo 4: Testar Localmente

```bash
# 1. Rodar servidor de desenvolvimento
npm run dev

# 2. Abrir navegador
# http://localhost:3000

# 3. Você deve ver a home page
```

Se aparecer erro de banco de dados:
- Verificar `.env.local`
- Rodar `npx prisma migrate dev --name init` novamente

---

## 📡 Passo 5: Configurar TradingView Webhooks

### 5.1 Gerar Secret

Você já tem em `.env.local`:
```
TRADINGVIEW_WEBHOOK_SECRET=seu-valor
```

Guardar esse valor.

### 5.2 Configurar em TradingView

1. Logar em TradingView
2. Ir para "Alertas" (Alerts)
3. Criar novo alerta:
   - Símbolo: **ZS** (Soja)
   - Condição: "Sempre" ou "Quando preço fecha"
   - Ação: **Webhook**
   - URL: `https://seu-app.railway.app/api/webhooks/tradingview`
   - Método: POST
   - Header adicional:
     ```
     x-tradingview-secret: <seu-secret-aqui>
     ```
   - Body:
     ```json
     {
       "symbol": "{{symbol}}",
       "close": {{close}},
       "high": {{high}},
       "low": {{low}},
       "volume": {{volume}},
       "time": {{unix_timestamp}}
     }
     ```

4. Repetir para:
   - **ZC** (Milho)
   - **ZW** (Trigo)

### 5.3 Testar Webhook

#### Teste local:
```bash
curl -X POST http://localhost:3000/api/webhooks/tradingview \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: seu-secret" \
  -d '{
    "symbol": "ZS",
    "close": 565.50,
    "high": 568.00,
    "low": 563.00,
    "volume": 150000,
    "time": 1704067200
  }'
```

Deve retornar:
```json
{
  "ok": true,
  "cotacao": {
    "grao": "soja",
    "preco": "565.50",
    "dolarReal": "5.45",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### Teste em produção (Railway):
```bash
curl -X POST https://seu-app.railway.app/api/webhooks/tradingview \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: seu-secret" \
  -d '{
    "symbol": "ZS",
    "close": 565.50,
    "high": 568.00,
    "low": 563.00,
    "volume": 150000,
    "time": 1704067200
  }'
```

---

## 🎯 Passo 6: Verificar Integração Investing.com

### Testar Scraping:

```bash
# Criar arquivo test-investing.js
cat > test-investing.js << 'EOF'
const { getExchangeRate } = require('./lib/investing-client')

getExchangeRate().then(rate => {
  console.log('Taxa USD/BRL:', rate)
})
EOF

# Rodar
node test-investing.js
```

Deve retornar algo como:
```
Taxa USD/BRL: 5.45
```

---

## ✅ Passo 7: Checklist Final

- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env.local` configurado
- [ ] PostgreSQL conectado (`npx prisma migrate dev`)
- [ ] Redis conectado (teste em `.env.local`)
- [ ] Railway deployando automaticamente
- [ ] Servidor rodando localmente (`npm run dev`)
- [ ] Webhook TradingView configurado
- [ ] Taxa Investing.com sendo buscada
- [ ] Você consegue acessar `http://localhost:3000`

---

## 🆘 Troubleshooting

### "Cannot find module 'redis'"

```bash
npm install
```

### "Error: connect ECONNREFUSED 127.0.0.1:5432"

PostgreSQL não está rodando. Opções:
1. Se usar Railway: Ignorar (vai funcionar em prod)
2. Se usar local: `docker run -d -p 5432:5432 postgres:latest`

### "NEXTAUTH_SECRET is not configured"

```bash
# Gerar novo
openssl rand -base64 32

# Adicionar em .env.local
NEXTAUTH_SECRET=<colar-aqui>
```

### Webhook retorna 401 Unauthorized

- Secret em `.env.local` não bate com header TradingView
- Verificar exatamente igual (case-sensitive)

### Taxa USD/BRL não busca

- Investing.com pode ter mudado seletor CSS
- Verificar página: https://br.investing.com/currencies/usd-brl
- Atualizar seletor em `lib/investing-client.ts`

---

## 🚀 Próximo Passo

Quando tudo estiver funcionando:

1. Começar **Task #3 (SEMANA 1-2):** Auth + CRM
2. Implementar login/signup
3. CRUD de clientes

---

*Tudo ok? Avisa quando estiver pronto para Task #3!* 👑
