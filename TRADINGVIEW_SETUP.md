# 📊 TradingView Webhooks Setup

**Tempo estimado:** 15 minutos

**Pré-requisito:** Railway deve estar ✅ deployado com URL pública

---

## 🎯 O que vamos fazer

Configurar 3 alertas em TradingView que disparam webhooks para seu backend:

- **ZS** = Soja (preço em cents/bushel)
- **ZC** = Milho (preço em cents/bushel)
- **ZW** = Trigo (preço em cents/bushel)

Cada vez que o preço fecha, TradingView envia um webhook com:
- Símbolo (ZS/ZC/ZW)
- Preço (close)
- Alto/Baixo do dia
- Volume
- Timestamp

Seu backend recebe, valida, busca taxa USD/BRL do Investing.com, e salva tudo em PostgreSQL.

---

## 1️⃣ Logar em TradingView

**URL:** https://www.tradingview.com

1. Clicar **"Sign In"** (canto superior direito)
2. Usar email/senha (ou Google/GitHub)
3. Confirmar login

---

## 2️⃣ Acessar Alertas

1. No menu superior, procurar **"Alertas"** ou **"Alerts"**
2. OU clicar no sino (🔔) no menu
3. Selecionar **"Create Alert"** ou **"Novo Alerta"**

---

## 3️⃣ Criar Alerta para ZS (Soja)

### Passo A: Símbolo

1. Na caixa de busca, digitar **`ZS`**
2. Apareça a opção **"CME_MINI:ZS"** (Soja futures)
3. Clicar para selecionar

### Passo B: Condição

1. Campo **"Condition"** (ou "Condição"):
   - Deixar como **"Always"** (ou **"Sempre"**)
   - Isso faz o webhook disparar toda vez que há mudança

### Passo C: Ação

1. Campo **"Action"** (ou "Ação"):
   - Selecionar **"Webhook"**
   - Clicar em **"Add Webhook"**

### Passo D: Configurar Webhook

Apareça uma caixa com campos:

**URL:**
```
https://seu-app-railway.railway.app/api/webhooks/tradingview
```

**Substituir `seu-app-railway` pela URL real do seu Railway!**

Exemplo real:
```
https://mercograin-prod-xxxx.railway.app/api/webhooks/tradingview
```

**Headers (se houver campo):**

Nome do header:
```
x-tradingview-secret
```

Valor:
```
0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280
```

**Body (JSON a enviar):**

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

**⚠️ IMPORTANTE:** Use exatamente os `{{placeholders}}` acima. TradingView substitui pelos valores reais.

### Passo E: Salvar

1. Clicar **"Create"** (ou **"Criar"**)
2. Alerta criado para ZS ✅

---

## 4️⃣ Criar Alerta para ZC (Milho)

Repetir os passos acima, mas:

**Passo A:** Digitar **`ZC`** em vez de ZS
(Rest igual)

---

## 5️⃣ Criar Alerta para ZW (Trigo)

Repetir os passos acima, mas:

**Passo A:** Digitar **`ZW`** em vez de ZS
(Rest igual)

---

## ✅ Verificar Alertas Criados

1. Ir para **"Alertas"** (sino 🔔)
2. Você deve ver 3 alertas:
   - CME_MINI:ZS
   - CME_MINI:ZC
   - CME_MINI:ZW

Todos com webhook ✅

---

## 🧪 Testar Localmente

Antes de confiar na integração, teste manualmente:

```bash
# 1. Ter seu servidor rodando localmente
npm run dev
# Deve estar em http://localhost:3000

# 2. Em outro terminal, rodar script de teste
chmod +x test-webhook.sh
./test-webhook.sh

# Você deve ver respostas como:
# {"ok":true,"cotacao":{...}}
```

---

## 🧪 Testar em Produção (Railway)

Quando Railway estiver ✅:

```bash
# Substituir seu-app-railway pela URL real
curl -X POST https://seu-app-railway.railway.app/api/webhooks/tradingview \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: 0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280" \
  -d '{
    "symbol": "ZS",
    "close": 565.50,
    "high": 568.00,
    "low": 563.00,
    "volume": 150000,
    "time": 1704067200
  }'

# Deve retornar:
# {"ok":true,"cotacao":{"grao":"soja","preco":"565.50","dolarReal":"5.45",...}}
```

---

## 📱 Testar com TradingView Real

Quando Railway está ✅ e alertas configurados:

1. Abrir gráfico de ZS em TradingView
2. Esperar fechar uma vela (1 hora, 4 horas, 1 dia, etc)
3. TradingView automaticamente dispara webhook
4. Seu backend recebe e salva em PostgreSQL
5. Você vê dados novos em `/api/cotacoes`

**⚠️ Teste pode levar horas:** Depende do timeframe (se usar 1D, precisa esperar 1 dia inteiro)

---

## ✅ Checklist TradingView

- [ ] Logado em TradingView
- [ ] Acesso a Alertas
- [ ] Alerta ZS criado com webhook
- [ ] Alerta ZC criado com webhook
- [ ] Alerta ZW criado com webhook
- [ ] URL Railway correta nos webhooks
- [ ] Secret correto nos headers
- [ ] Body JSON com {{placeholders}} correto
- [ ] Teste local bem-sucedido (curl)
- [ ] Teste produção bem-sucedido (curl Railway)

---

## 🆘 Troubleshooting TradingView

### "Webhook URL inválida"
- Verificar se URL começa com `https://`
- Verificar se Railway está ✅ deployado
- Testar URL no navegador (deve retornar página ou erro)

### "Webhook não dispara"
- Verificar se gráfico está aberto (precisa estar)
- Esperar fechar uma vela (pode levar horas em D1)
- Ver em Railway logs se webhook chegou

### "Erro 401 Unauthorized"
- Secret está errado
- Verificar em `.env.local`:
  ```
  TRADINGVIEW_WEBHOOK_SECRET=0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280
  ```

### "Erro 404 Not Found"
- Endpoint está errado
- URL deve terminar em `/api/webhooks/tradingview`
- Verificar typo na URL

### "Timeout na requisição"
- Railway pode estar muito lenta
- Checar logs em Railway dashboard
- Pode ser problema de banco de dados

---

## 📚 Próximos Passos

Quando tiver:
- ✅ Railway deployado
- ✅ Alertas TradingView configurados
- ✅ Testes bem-sucedidos

Você pode:
1. **Ver cotações** em: `https://seu-app.railway.app/api/cotacoes`
2. **Começar Semana 1-2** (Auth + CRM) → Task #3
3. **Expandir** para propostas, contratos, boletos

---

*TradingView Setup Completo!*
