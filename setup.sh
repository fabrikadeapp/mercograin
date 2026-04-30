#!/bin/bash

# setup.sh - Script de setup automático para MercoGrain
# Modo YOLO: Máxima automação

set -e

echo "🚀 MercoGrain Setup Script"
echo "=========================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar pré-requisitos
echo -e "${BLUE}[1/5] Verificando pré-requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js não encontrado. Instale em https://nodejs.org${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}❌ npm não encontrado${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}❌ Git não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo -e "${GREEN}✅ Git $(git --version | head -n1)${NC}"
echo ""

# 2. Instalar dependências
echo -e "${BLUE}[2/5] Instalando dependências npm...${NC}"
npm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

# 3. Criar .env.local se não existir
echo -e "${BLUE}[3/5] Configurando .env.local...${NC}"

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}ℹ️  Criando .env.local a partir do template${NC}"
    cp .env.example .env.local

    # Gerar NEXTAUTH_SECRET
    SECRET=$(openssl rand -base64 32)

    # Atualizar .env.local com secret (bash trick)
    sed -i "s/gerar-com-openssl-rand-base64-32/$SECRET/" .env.local

    echo -e "${GREEN}✅ .env.local criado${NC}"
    echo -e "${YELLOW}⚠️  Edite .env.local com suas credenciais (DATABASE_URL, REDIS_URL, API keys)${NC}"
    echo ""
    echo "Variáveis que você precisa preencher:"
    echo "  - DATABASE_URL"
    echo "  - REDIS_URL"
    echo "  - TRADINGVIEW_WEBHOOK_SECRET"
    echo "  - BRASPAG_MERCHANT_ID"
    echo "  - BRASPAG_API_KEY"
    echo "  - TWILIO_ACCOUNT_SID"
    echo "  - TWILIO_AUTH_TOKEN"
    echo "  - TWILIO_PHONE_NUMBER"
    echo "  - SIGNATURELY_API_KEY"
    echo "  - SENDGRID_API_KEY"
else
    echo -e "${GREEN}✅ .env.local já existe${NC}"
fi
echo ""

# 4. Gerar Prisma Client
echo -e "${BLUE}[4/5] Gerando Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma Client gerado${NC}"
echo ""

# 5. Informações finais
echo -e "${BLUE}[5/5] Setup finalizado!${NC}"
echo ""
echo -e "${GREEN}✅ Tudo pronto!${NC}"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Edite .env.local com suas credenciais:"
echo "   nano .env.local"
echo ""
echo "2. Quando conectar Railway, você vai obter:"
echo "   - DATABASE_URL (PostgreSQL)"
echo "   - REDIS_URL (Redis)"
echo ""
echo "3. Rode localmente:"
echo "   npm run dev"
echo ""
echo "4. Para migrations do banco de dados:"
echo "   npx prisma migrate dev --name init"
echo ""
echo "5. Ver documentação em:"
echo "   - COMECA_AQUI.md (quick start)"
echo "   - templates/SETUP_INICIAL.md (detalhado)"
echo "   - README.md (completo)"
echo ""
echo -e "${YELLOW}💡 Você está em YOLO MODE - tudo está pronto para você começar a codar!${NC}"
echo ""
