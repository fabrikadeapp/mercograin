#!/bin/bash

# test-webhook.sh
# Testar webhook TradingView localmente

echo "🧪 Testando Webhook TradingView"
echo "================================"
echo ""

# URL do webhook
URL="http://localhost:3000/api/webhooks/tradingview"
SECRET="0c117ba39a0441546bb88fcc54f969b6d8ca362a3a64d3049e4769f763045280"

echo "📡 URL: $URL"
echo "🔐 Secret: $SECRET"
echo ""

# Teste 1: ZS (Soja)
echo "1️⃣  Testando ZS (Soja)..."
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: $SECRET" \
  -d '{
    "symbol": "ZS",
    "close": 565.50,
    "high": 568.00,
    "low": 563.00,
    "volume": 150000,
    "time": 1704067200
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Teste 2: ZC (Milho)
echo "2️⃣  Testando ZC (Milho)..."
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: $SECRET" \
  -d '{
    "symbol": "ZC",
    "close": 428.75,
    "high": 430.00,
    "low": 427.50,
    "volume": 180000,
    "time": 1704067200
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Teste 3: ZW (Trigo)
echo "3️⃣  Testando ZW (Trigo)..."
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: $SECRET" \
  -d '{
    "symbol": "ZW",
    "close": 536.25,
    "high": 538.50,
    "low": 535.00,
    "volume": 120000,
    "time": 1704067200
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Teste 4: Com secret inválido (deve falhar)
echo "4️⃣  Testando com secret inválido (deve retornar 401)..."
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "x-tradingview-secret: invalid-secret" \
  -d '{"symbol":"ZS","close":565.50}' \
  -w "\nStatus: %{http_code}\n\n"

echo "✅ Testes concluídos!"
echo ""
echo "💡 Se viu 'ok: true' nos primeiros 3, o webhook está funcionando!"
echo "💡 Se viu 401 no teste 4, a validação de secret está funcionando!"
