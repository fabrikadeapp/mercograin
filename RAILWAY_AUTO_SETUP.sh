#!/bin/bash

# RAILWAY AUTO SETUP - YOLO Mode
# Automação completa do Railway para MercoGrain

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🚂 RAILWAY AUTO SETUP - YOLO MODE                ║"
echo "║             Sistema Integrado Trading de Grãos            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Constantes
PROJECT_ID="3461830f-4bd2-4a50-a7b3-278c2a8c5c5c"
PROJECT_URL="https://railway.com/project/$PROJECT_ID"

echo -e "${BLUE}[1/5] Verificando Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}❌ Railway CLI não encontrado${NC}"
    echo "Instale com: npm install -g railway"
    exit 1
fi
echo -e "${GREEN}✅ Railway CLI encontrado${NC}"
echo ""

echo -e "${BLUE}[2/5] Verificando autenticação...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}❌ Não autenticado no Railway${NC}"
    echo "Execute: railway login"
    exit 1
fi
USER=$(railway whoami)
echo -e "${GREEN}✅ Autenticado como: $USER${NC}"
echo ""

echo -e "${BLUE}[3/5] Abrindo Railway Dashboard...${NC}"
echo "URL: $PROJECT_URL"
open "$PROJECT_URL" 2>/dev/null || xdg-open "$PROJECT_URL" 2>/dev/null || echo "Abra manualmente: $PROJECT_URL"
echo ""

echo -e "${YELLOW}⏳ Aguardando você provisionar PostgreSQL e Redis...${NC}"
echo ""
echo "INSTRUÇÕES (no Railway Dashboard):"
echo "  1. Clicar em 'Add Service' (botão azul + no topo)"
echo "  2. Selecionar 'Database'"
echo "  3. Selecionar 'PostgreSQL'"
echo "  4. Esperar provisionar (20-30 segundos)"
echo "  5. Repetir passos 1-4 para 'Redis'"
echo ""
echo "⏱️  Aguardando 5 minutos... (ou pressione ENTER quando terminar)"
echo ""

# Aguardar com timeout
timeout 300s bash -c 'read -p "Pressione ENTER quando terminar o setup no Railway: " || true' || true

echo ""
echo -e "${BLUE}[4/5] Tentando obter credenciais...${NC}"

# Tentar pegar status do projeto
echo "Status do projeto:"
railway status

echo ""
echo -e "${BLUE}[5/5] Próximos passos:${NC}"
echo ""
echo -e "${YELLOW}Manual (copie do Railway Dashboard):${NC}"
echo "  1. Abra: $PROJECT_URL"
echo "  2. Clique em PostgreSQL (lado esquerdo)"
echo "  3. Aba 'Connect' → Copie DATABASE_URL"
echo "  4. Clique em Redis"
echo "  5. Aba 'Connect' → Copie REDIS_URL"
echo "  6. Edite .env.local e cole:"
echo "     DATABASE_URL=\"copie-aqui\""
echo "     REDIS_URL=\"copie-aqui\""
echo ""
echo -e "${GREEN}✅ Depois de preencher .env.local, execute:${NC}"
echo "  npx prisma migrate dev --name init"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Railway Deploy (automático a cada git push):${NC}"
echo "  git add ."
echo "  git commit -m 'Env configured for Railway'"
echo "  git push"
echo ""

# Abrir .env.local para edição (se possível)
if command -v code &> /dev/null; then
    read -p "Abrir .env.local em VS Code? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        code .env.local
    fi
fi

echo ""
echo -e "${GREEN}✅ Railway Auto Setup Concluído!${NC}"
