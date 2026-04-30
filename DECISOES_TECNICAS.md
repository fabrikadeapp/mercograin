# Decisões Técnicas - MercoGrain MVP

## 1. Stack Recomendado

### Frontend + Backend (Next.js)
- **Decisão:** Next.js 14 com App Router
- **Motivo:** 1 desenvolvedor, máxima produtividade
- **Alternativas rejeitadas:**
  - Frontend separado (React + Vite): Mais complexo, mais deploy
  - Django/Python: Aprendizado novo
- **Tradeoff:** Menos escalável para times enormes, mas perfeito para MVP

### Banco de Dados (PostgreSQL + Prisma)
- **Decisão:** PostgreSQL com Prisma ORM
- **Motivo:**
  - PostgreSQL: ACID, relacionamentos, JSON nativo
  - Prisma: Type-safe, migrations automáticas, DX excelente
- **Alternativas rejeitadas:**
  - MongoDB: Não precisa de flexibilidade, dados muito estruturados
  - Raw SQL: Sem type safety, mais bugs

### Cache (Redis)
- **Decisão:** ioredis cliente
- **Motivo:**
  - Cotações precisam de cache rápido
  - Bull para jobs assíncronos
  - Taxa USD/BRL cache 1h
- **Alternativas rejeitadas:**
  - Memory cache: Perde dados se reiniciar
  - Memcached: Redis é superior em features

## 2. Integrações

### Cotações: TradingView + Investing.com
- **Decisão:** Webhooks TradingView (tempo real) + Scraping Investing.com (câmbio)
- **Motivo:**
  - Você já assina TradingView ✅
  - Investing.com gratuito
  - Zero custos extras
- **Como funciona:**
  1. TradingView dispara webhook quando ZS/ZC/ZW muda
  2. Backend recebe e salva em PostgreSQL
  3. Simultaneamente busca taxa USD/BRL do Investing.com
  4. Dashboard exibe em tempo real
- **Alternativas rejeitadas:**
  - IQFeed: $100/mês (desnecessário, você tem TradingView)
  - Quandl: Atualização apenas 1x/dia
  - SEFAZ/B3: Não é padrão global

### Boletos: Braspag
- **Decisão:** Braspag como abstração para múltiplos bancos
- **Motivo:**
  - 1 API para Itaú, Sicredi, Nubank, C6, Caixa, Bradesco, Santander
  - Webhook automático de confirmação
  - Menos trabalho de integração específica
- **Alternativas rejeitadas:**
  - Integrar cada banco: Duplicação, complexidade
  - PagSeguro: Menos bancos, menos controle

### WhatsApp: Twilio
- **Decisão:** Twilio API oficial
- **Motivo:**
  - Confiável
  - Relatórios automáticos por departamento
  - Fácil auditoria
- **Alternativas rejeitadas:**
  - Chatwoot: Overkill para MVP
  - WhatsApp Business API direto: Complexo, precisa aprovar, sem webhook

### Assinatura Eletrônica: Signaturely
- **Decisão:** Signaturely (free tier 5 docs/mês)
- **Motivo:**
  - Gratuito no MVP
  - Upgrade fácil depois
  - Integração simples
- **Alternativas rejeitadas:**
  - Docusign: Caro ($30+)
  - Jus.com.br: Bom mas menos conhecido

### Email: SendGrid
- **Decisão:** SendGrid (free tier 100 emails/dia)
- **Motivo:**
  - Gratuito
  - Transacional
  - Entrega garantida
- **Alternativas rejeitadas:**
  - Nodemailer SMTP: Menos confiável, sem log
  - Mailgun: Pagos desde o início

## 3. Autenticação

### NextAuth.js
- **Decisão:** NextAuth.js com CredentialsProvider
- **Motivo:**
  - Integrado com Next.js
  - JWT automático
  - Sessões gerenciadas
- **MVP:** Email/senha simples
- **Future:** OAuth2 (Google, GitHub) quando precisar compartilhar com clientes

## 4. Arquitetura de Dados

### Schema Prisma Completo
- **7 modelos principais:**
  1. User (autenticação)
  2. Cliente (CRM)
  3. Cotacao (histórico preços)
  4. TaxaCambio (histórico taxa USD/BRL)
  5. Proposta (propostas comerciais)
  6. Contrato (contratos assinados)
  7. Boleto (boletos de cobrança)

- **Relacionamentos:**
  - Cliente ← Proposta ← Contrato ← Boleto (cascata natural)
  - TaxaCambio (histórico isolado)
  - Cotacao (apenas leitura, append-only)

### Indexes Estratégicos
- Todas as ForeignKeys indexadas
- Status e datas indexadas (queries frequentes)
- Email/CNPJ indexados (busca cliente)

## 5. Processamento Assíncrono

### Bull para Jobs
- **Usado para:**
  - Atualizar cotações (a cada 5 min)
  - Atualizar taxa USD/BRL (a cada 1 hora)
  - Enviar avisos WhatsApp vencimento
  - Enviar emails notificação
- **Por que:** Não bloqueia requisições HTTP

## 6. Webhooks

### TradingView → /api/webhooks/tradingview
- Estrutura: POST com validação de secret
- Log auditoria em WebhookLog
- Fallback se Investing.com cair

### Braspag → /api/webhooks/braspag
- Confirmação de pagamentos
- Atualização status boleto
- Notificação WhatsApp

### Signaturely → /api/webhooks/signaturely
- Confirmação de assinatura
- Atualização status contrato

## 7. Scraping Investing.com

### Por que Scraping?
- Investing.com não tem API pública oficial
- É a fonte mais confiável de câmbio tempo real
- Caching reduz carga

### Robustez
- Múltiplos seletores CSS (fallback se layout mudar)
- Timeout de 10s
- Cache local (Redis)
- Graceful degradation se falhar

### Alternativas rejeitadas
- API Alpha Vantage: Lento, demora
- Quandl: Atualização apenas 1x/dia
- Manual: Você colocar taxa manualmente (não escala)

## 8. Deployment: Railway

### Por que Railway?
- Suporta Next.js nativamente
- PostgreSQL + Redis managed
- Deploy automático GitHub → Production
- Logs em tempo real
- Preços justos (~$5-20/mês MVP)

### Alternativas rejeitadas
- Vercel: Mais caro, sem DB gerenciado
- Heroku: Descontinuou plano gratuito
- AWS/GCP: Muito complexo para 1 dev

## 9. ORM: Prisma vs Alternatives

| Feature | Prisma | TypeORM | Sequelize | Raw SQL |
|---------|--------|---------|-----------|---------|
| Type Safety | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ❌ |
| Migrations | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Manual |
| DX | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Curva Aprendizado | Baixa | Alta | Média | Baixa |
| Speed | Rápido | Médio | Lento | Rápido |

**Vencedor:** Prisma para MVP com 1 dev

## 10. Frontend: React + Tailwind

### Por que Tailwind?
- Next.js vem com suporte
- Rápido prototipagem
- Consistência visual
- Sem CSS customizado complexo

### Componentes
- Não usar componentização excessiva no MVP
- Componentes simples e reutilizáveis
- React Hook Form para formulários (type-safe)
- Zod para validação schema

## 11. Decisões Não Feitas (Fase 2+)

### ❌ NF-e (Nota Fiscal)
- Complexidade: Certificado digital, SEFAZ, regras fiscal
- **Quando:** Semana 10+ (depois MVPfuncionar)
- **Por que:** MVP não precisa de faturamento legal, propostas/contratos bastam

### ❌ Conciliação Bancária
- Complexidade: Múltiplos formatos de banco, reconciliação complexa
- **Quando:** Fase 2 (depois boletos funcionarem 1 mês)

### ❌ Instagram Integration
- Menos prioritário que boletos/pagamento
- **Quando:** Fase 2

### ❌ Analytics Avançado
- Pode vir com Sentry + logs básicos
- **Quando:** Quando tiver padrões de uso

## 12. Segurança

### Princípios
1. **Validação:** Zod em todos os endpoints
2. **SQL Injection:** Prisma parameteriza tudo
3. **XSS:** React escapa HTML por padrão
4. **CSRF:** Next.js gerencia tokens
5. **Secrets:** Nunca em git (.env.local)
6. **Logs:** Webhook logs para auditoria

### Future
- Rate limiting (depois de launch)
- 2FA (depois de launch)
- RLS PostgreSQL (depois de multi-tenant)

## 13. Performance

### Inicial (MVP)
- PostgreSQL índices estratégicos
- Redis cache (cotações, câmbio)
- Next.js SSR onde possível

### Future (Fase 2+)
- Image optimization
- Database connection pooling
- Query optimization (após profiling)
- CDN para assets

## 14. Logging e Monitoramento

### MVP
- Console logs estruturados
- Webhook logs em BD (auditoria)
- Sentry (opcional, free tier)

### Future
- CloudWatch ou Datadog
- Alertas Slack
- Dashboards Grafana

---

## Sumário de Escolhas

| Decisão | Escolha | Porque |
|---------|---------|--------|
| Stack | Next.js + React | 1 dev, máxima produtividade |
| Database | PostgreSQL + Prisma | Type-safe, migrations automáticas |
| Cache | Redis | Cotações, jobs assíncronos |
| Cotações | TradingView + Investing.com | Você assina TradingView, gratuito |
| Boletos | Braspag | 1 API, múltiplos bancos |
| WhatsApp | Twilio | Confiável, webhook |
| Assinatura | Signaturely | Gratuito MVP |
| Deploy | Railway | Simples, automático |
| Auth | NextAuth.js | Integrado Next.js |

**Filosofia:** MVP rápido, escalável depois. Sem over-engineering.

---

*Última atualização: 2026-04-29*
*Modo: YOLO (decisões autônomas, 0 perguntas)*
