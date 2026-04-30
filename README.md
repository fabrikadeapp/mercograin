# MercoGrain Trading System

Sistema integrado de **cotação, proposta, contrato e cobrança** para trading de grãos (soja, milho, trigo).

## 🎯 Features MVP

- ✅ Cotações em tempo real via TradingView + Investing.com
- ✅ Gestão de clientes (CRM)
- ✅ Elaboração de propostas
- ✅ Contratos com assinatura eletrônica
- ✅ Boletos com múltiplos bancos (Itaú, Sicredi, Nubank, C6, etc)
- ✅ Notificações WhatsApp
- ✅ Dashboard de indicadores

## 🚀 Quick Start

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/mercograin.git
cd mercograin
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Ambiente

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local com suas credenciais
# DATABASE_URL, NEXTAUTH_SECRET, API keys, etc
```

### 4. Preparar Banco de Dados

```bash
# Criar schema no PostgreSQL
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate
```

### 5. Rodar Localmente

```bash
npm run dev
```

Abrir: http://localhost:3000

## 🔌 Integrações

### TradingView (Cotações CBOT)

1. **Configurar Alertas em TradingView:**
   - Logar em TradingView
   - Ir para **Alertas** (Alerts)
   - Criar novo alerta para cada símbolo:
     - **ZS** (Soja)
     - **ZC** (Milho)
     - **ZW** (Trigo)

2. **Configurar Webhook:**
   - Webhook URL: `https://seu-app.railway.app/api/webhooks/tradingview`
   - Header: `x-tradingview-secret: <seu-secret-aqui>`
   - Body (JSON):
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

3. **Validar no Localhost:**
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

### Investing.com (Câmbio USD/BRL)

- Automático! Scraping acontece em background
- Cache: 1 hora
- Fallbacks se página mudar

### Braspag (Boletos)

```javascript
// Credenciais em .env.local
BRASPAG_MERCHANT_ID=seu-id
BRASPAG_API_KEY=sua-chave
BRASPAG_ENVIRONMENT=sandbox // ou production
```

### Twilio (WhatsApp)

```javascript
// Credenciais em .env.local
TWILIO_ACCOUNT_SID=seu-sid
TWILIO_AUTH_TOKEN=seu-token
TWILIO_PHONE_NUMBER=+5511999999999
```

### Signaturely (Assinatura)

```javascript
// Credencial em .env.local
SIGNATURELY_API_KEY=sua-chave
```

## 📊 API Endpoints

### Cotações

```bash
# Listar cotações
GET /api/cotacoes
GET /api/cotacoes?grao=soja&dias=7&limit=100

# Criar cotação (fallback/teste)
POST /api/cotacoes
# Body: {grao: "soja", preco: 565.50, simbolo: "ZS"}
```

### Webhooks

```bash
# TradingView
POST /api/webhooks/tradingview

# Braspag (boletos)
POST /api/webhooks/braspag

# Signaturely (assinatura)
POST /api/webhooks/signaturely
```

## 🗄️ Banco de Dados (Prisma)

### Tabelas Principais

- **User**: Autenticação
- **Cliente**: Clientes (CRM)
- **Cotacao**: Histórico de cotações
- **TaxaCambio**: Taxa USD/BRL
- **Proposta**: Propostas comerciais
- **Contrato**: Contratos assinados
- **Boleto**: Boletos de cobrança

### Migrations

```bash
# Ver migrations
npx prisma migrate list

# Criar nova migration
npx prisma migrate dev --name sua-migration

# Resetar banco (⚠️ perdido de dados!)
npx prisma migrate reset
```

## 🔐 Autenticação

Usar NextAuth.js com credenciais:

```javascript
// Padrão desenvolvimento
Email: dev@mercograin.com
Senha: 123456
```

**⚠️ Mudar em produção!**

## 🚢 Deploy no Railway

### 1. Conectar GitHub

- Ir para https://railway.app
- Login com GitHub
- Selecionar repositório

### 2. Configurar Variáveis

No dashboard Railway, adicionar:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<gerar novo>
NEXTAUTH_URL=https://seu-dominio.railway.app
TRADINGVIEW_WEBHOOK_SECRET=seu-secret
REDIS_URL=seu-redis-url
```

### 3. Deploy Automático

- Cada push em `main` → deploy automático
- Ver logs em tempo real
- Rollback automático se falhar

## 📝 Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 14 (React) + Tailwind CSS |
| **Backend** | Node.js + Express (API Routes) |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache** | Redis |
| **Autenticação** | NextAuth.js |
| **Scraping** | Cheerio + Axios |
| **Deployment** | Railway |

## 📚 Estrutura de Pastas

```
mercograin/
├── app/                    # Next.js App Router
│   ├── api/               # Backend endpoints
│   │   ├── webhooks/      # Webhooks (TradingView, Braspag)
│   │   ├── cotacoes/      # Cotações
│   │   ├── clientes/      # Clientes (fase 2)
│   │   ├── propostas/     # Propostas (fase 2)
│   │   └── contratos/     # Contratos (fase 2)
│   ├── cotacoes/          # Página cotações
│   ├── clientes/          # Página clientes (fase 2)
│   └── layout.tsx         # Layout global
├── lib/                   # Utilitários
│   ├── investing-client.ts    # Scraping Investing.com
│   ├── tradingview-webhook.ts # Webhook handler
│   ├── db.ts              # Prisma client
│   └── redis.ts           # Redis client
├── prisma/
│   ├── schema.prisma      # Definição de tabelas
│   └── migrations/        # Histórico migrations
├── .env.example           # Template variáveis ambiente
├── package.json
└── README.md
```

## 🧪 Testando Localmente

### 1. Webhook TradingView

```bash
curl -X POST http://localhost:3000/api/webhooks/tradingview \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: test-secret" \
  -d '{
    "symbol": "ZS",
    "close": 565.50,
    "high": 568.00,
    "low": 563.00,
    "volume": 150000,
    "time": 1704067200
  }'
```

### 2. Listar Cotações

```bash
curl http://localhost:3000/api/cotacoes
curl http://localhost:3000/api/cotacoes?grao=soja&dias=7
```

### 3. Criar Cotação (teste)

```bash
curl -X POST http://localhost:3000/api/cotacoes \
  -H "Content-Type: application/json" \
  -d '{
    "grao": "soja",
    "preco": 565.50,
    "simbolo": "ZS"
  }'
```

## 🐛 Troubleshooting

### PostgreSQL não conecta

```bash
# Verificar URL
echo $DATABASE_URL

# Teste de conexão
psql $DATABASE_URL
```

### Redis não conecta

```bash
# Verificar URL
echo $REDIS_URL

# Teste
redis-cli -u $REDIS_URL ping
```

### Webhook TradingView não chega

1. Verificar secret está correto
2. URL pública está acessível
3. Verificar logs em Railway dashboard
4. Testar com curl (comando acima)

## 📞 Próximas Fases

### Phase 2 (Semana 1-2)
- Clientes CRUD
- Autenticação aprimorada

### Phase 3 (Semana 3-4)
- Propostas
- Geração PDF

### Phase 4 (Semana 5-6)
- Contratos
- Assinatura eletrônica

### Phase 5 (Semana 6-7)
- Boletos
- Confirmação de pagamento

## 📄 Licença

MIT

---

**Desenvolvido com 👑 por Orion (AIOS Master)**
