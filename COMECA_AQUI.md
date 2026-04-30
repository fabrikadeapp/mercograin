# 🚀 COMEÇA AQUI - 3 Passos para Começar

## 👑 Você está em YOLO MODE
Tudo preparado para você começar a desenvolver AGORA. Nenhuma pergunta mais.

---

## ✅ O QUE FOI CRIADO PARA VOCÊ

**Tudo que você precisa está em `/Users/gustavoholderbaumvieira/code/mercograin`:**

1. ✅ **Estrutura Next.js + Prisma** - Pronta para clonar
2. ✅ **Integração Investing.com** - Câmbio USD/BRL automático
3. ✅ **Webhook TradingView** - Receber cotações CBOT em tempo real
4. ✅ **Schema Prisma Completo** - 7 tabelas para MVP
5. ✅ **Documentação Detalhada** - README + DECISOES_TECNICAS
6. ✅ **Guia de Setup** - SETUP_INICIAL.md com passo-a-passo

---

## 📋 ARQUIVOS CRIADOS

```
mercograin/
├── .env.example                    ✅ Template variáveis
├── package.json                    ✅ Dependências
├── README.md                       ✅ Documentação completa
├── DECISOES_TECNICAS.md            ✅ Por que cada escolha
├── COMECA_AQUI.md                  ✅ Este arquivo
│
├── prisma/
│   └── schema.prisma               ✅ Schema completo (7 tabelas)
│
├── lib/
│   ├── investing-client.ts         ✅ Scraping USD/BRL, ouro, petróleo
│   ├── redis.ts                    ✅ Cliente Redis
│   └── db.ts                       ✅ Cliente Prisma
│
├── app/
│   └── api/
│       ├── webhooks/
│       │   └── tradingview/
│       │       └── route.ts        ✅ Webhook TradingView (cotações)
│       └── cotacoes/
│           └── route.ts            ✅ CRUD cotações + USD/BRL
│
└── templates/
    └── SETUP_INICIAL.md            ✅ Passo-a-passo setup
```

---

## 🎯 PRÓXIMOS 3 PASSOS

### **PASSO 1: Setup Local (30 min)**

```bash
cd /Users/gustavoholderbaumvieira/code/mercograin

# 1. Instalar deps
npm install

# 2. Copiar .env
cp .env.example .env.local

# 3. Gerar NEXTAUTH_SECRET
openssl rand -base64 32
# Copiar saída e colar em .env.local

# 4. Editar .env.local
# Abrir em editor e preencher:
# - DATABASE_URL (vai vir do Railway)
# - REDIS_URL (vai vir do Railway)
# - Credenciais das APIs (Braspag, Twilio, etc)
# - TRADINGVIEW_WEBHOOK_SECRET (qualquer string aleatória)

# 5. Testar localmente
npm run dev
# Abrir http://localhost:3000
```

**Vai dar erro de DB? Normal - você ainda não conectou Railway.**

---

### **PASSO 2: Conectar Railway (20 min)**

1. **Ir para https://railway.app**
2. **Logar com GitHub**
3. **Clicar "New Project" → Selecionar repositório `mercograin`**
4. **Railway vai criar automaticamente:**
   - PostgreSQL
   - Redis
   - Node.js server

5. **Copiar Connection Strings:**
   - PostgreSQL → PostgreSQL → "Connect" → DATABASE_URL
   - Redis → Redis → "Connect" → REDIS_URL
   - Adicionar em `.env.local` E em "Variables" no Railway

6. **Push para Railway:**
   ```bash
   git add .
   git commit -m "Initial setup with Investing.com integration"
   git push origin main
   ```

7. **Railway fará deploy automático** - Ver logs em "Deployments"

---

### **PASSO 3: Configurar TradingView Webhooks (15 min)**

1. **Logar em TradingView**
2. **Ir para "Alertas"**
3. **Criar alerta para cada grão:**

   **Para ZS (Soja):**
   - Símbolo: ZS
   - Ação: Webhook
   - URL: `https://seu-app.railway.app/api/webhooks/tradingview`
   - Header: `x-tradingview-secret: seu-secret-de-env`
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

   **Repetir para ZC (Milho) e ZW (Trigo)**

4. **Testar webhook:**
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

   Deve retornar:
   ```json
   {"ok": true, "cotacao": {...}}
   ```

---

## 🎓 O QUE ESTÁ PRONTO PARA USAR

### Integração Investing.com
- ✅ Busca taxa USD/BRL automaticamente
- ✅ Cache 1 hora (Redis)
- ✅ Também busca ouro e petróleo (bônus)
- ✅ Fallback se site cair

### Webhook TradingView
- ✅ Recebe preços ZS, ZC, ZW
- ✅ Salva em PostgreSQL com histórico
- ✅ Validação de secret
- ✅ Log de auditoria

### API Cotações
- ✅ GET /api/cotacoes - Listar com filtros
- ✅ POST /api/cotacoes - Criar manualmente (teste)
- ✅ Estatísticas automáticas por grão

### Database Schema
- ✅ User (autenticação)
- ✅ Cliente (CRM)
- ✅ Cotacao (histórico preços)
- ✅ TaxaCambio (histórico USD/BRL)
- ✅ Proposta (propostas comerciais)
- ✅ Contrato (contratos)
- ✅ Boleto (boletos de cobrança)
- ✅ WebhookLog (auditoria)

---

## 📚 DOCUMENTAÇÃO DISPONÍVEL

- **README.md** - Documentação completa
- **DECISOES_TECNICAS.md** - Por que cada tecnologia
- **templates/SETUP_INICIAL.md** - Guia passo-a-passo detalhado
- **COMECA_AQUI.md** - Este arquivo (quick start)

---

## 🔥 ESTRUTURA PARA SEMANAS 1-8

Você tem **8 semanas** planejadas:

```
SEMANA 1-2: Auth + CRM Básico
SEMANA 3: Cotação Online (✅ PRONTA)
SEMANA 4: Propostas + PDF
SEMANA 5: Contratos + Assinatura
SEMANA 6-7: Boletos + Multi-banco
SEMANA 8: Polish + Deploy Produção
```

Cada semana tem um TASK correspondente com checklist.

---

## ⚡ RESUMO RÁPIDO

| O quê | Arquivo | Status |
|-------|---------|--------|
| Setup inicial | templates/SETUP_INICIAL.md | ✅ Leia primeiro |
| Estrutura Next.js | app/, lib/, prisma/ | ✅ Pronto |
| Investing.com | lib/investing-client.ts | ✅ Integrado |
| TradingView webhook | app/api/webhooks/tradingview/ | ✅ Pronto |
| Cotações API | app/api/cotacoes/ | ✅ Pronto |
| Database | prisma/schema.prisma | ✅ Pronto |
| Documentação | README.md + DECISOES_TECNICAS.md | ✅ Completa |

---

## 🚨 IMPORTANTE

### ⚠️ Antes de começar:
- [ ] Node.js 18+ instalado? `node --version`
- [ ] npm instalado? `npm --version`
- [ ] Git instalado? `git --version`

### ⚠️ Variáveis de Ambiente:
- **NUNCA** commitar `.env.local` em git
- **.env.example** é público (template)
- **Railway** tem secrets separados

### ⚠️ Segurança:
- TRADINGVIEW_WEBHOOK_SECRET: guarde em segurança
- API Keys: nunca colocar em código
- PostgreSQL: nunca usar senha em produção (Railway gera automaticamente)

---

## 🎯 ORDEM DE EXECUÇÃO

1. **HOJE:**
   - [ ] Ler SETUP_INICIAL.md
   - [ ] `npm install`
   - [ ] Configurar `.env.local`
   - [ ] `npm run dev` (vai falhar de BD, normal)

2. **AMANHÃ:**
   - [ ] Criar Railway project
   - [ ] Conectar PostgreSQL + Redis
   - [ ] Push para main (deploy automático)
   - [ ] Testar webhook TradingView

3. **DEPOIS:**
   - [ ] Começar Task #3 (Auth + CRM)
   - [ ] Implementar login/signup
   - [ ] CRUD de clientes

---

## 💬 Dúvidas?

Se travar:
1. Checar SETUP_INICIAL.md (seção Troubleshooting)
2. Ler README.md (respostas estão lá)
3. Verificar logs em Railway dashboard

---

## 🏁 Checklist para Começar AGORA

- [ ] Você abriu este arquivo
- [ ] Você sabe onde está o código (`/code/mercograin`)
- [ ] Você vai ler `templates/SETUP_INICIAL.md` antes de qualquer coisa
- [ ] Você tem `TRADINGVIEW_WEBHOOK_SECRET` anotado em lugar seguro

**Tudo pronto? VÁ PARA:** `templates/SETUP_INICIAL.md` 👉

---

*YOLO Mode Ativado ✅*
*Tudo que você precisa está aqui.*
*Só falta você começar a codar! 👑*

---

**Última atualização:** 2026-04-29
**Desenvolvido com:** Next.js 14, Prisma, PostgreSQL, Redis, TradingView, Investing.com
