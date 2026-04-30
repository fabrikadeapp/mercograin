-- CreateTable "User"
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Cliente"
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "cnpj" TEXT,
    "cpf" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "tipo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Cotacao"
CREATE TABLE "Cotacao" (
    "id" TEXT NOT NULL,
    "grao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "fonte" TEXT NOT NULL DEFAULT 'TradingView',
    "dolarReal" DECIMAL(10,4),
    "volume" INTEGER,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cotacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable "TaxaCambio"
CREATE TABLE "TaxaCambio" (
    "id" TEXT NOT NULL,
    "moedaDe" VARCHAR(3) NOT NULL,
    "moedaPara" VARCHAR(3) NOT NULL,
    "taxa" DECIMAL(10,4) NOT NULL,
    "fonte" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxaCambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Proposta"
CREATE TABLE "Proposta" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "dataValidade" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Contrato"
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "propostaIdFk" TEXT,
    "clienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DECIMAL(15,2) NOT NULL,
    "dataAssinatura" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Boleto"
CREATE TABLE "Boleto" (
    "id" TEXT NOT NULL,
    "contratoIdFk" TEXT,
    "clienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "banco" VARCHAR(20) NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "braspagId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateTable "WebhookLog"
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "simbolo" VARCHAR(10),
    "payload" TEXT NOT NULL,
    "resposta" TEXT,
    "status" TEXT NOT NULL DEFAULT 'recebido',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable "CacheData"
CREATE TABLE "CacheData" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CacheData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Cliente_usuarioId_idx" ON "Cliente"("usuarioId");

-- CreateIndex
CREATE INDEX "Cotacao_grao_data_simbolo_idx" ON "Cotacao"("grao", "data", "simbolo");

-- CreateIndex
CREATE INDEX "Proposta_clienteId_idx" ON "Proposta"("clienteId");

-- CreateIndex
CREATE INDEX "Proposta_status_idx" ON "Proposta"("status");

-- CreateIndex
CREATE INDEX "Contrato_clienteId_idx" ON "Contrato"("clienteId");

-- CreateIndex
CREATE INDEX "Contrato_status_idx" ON "Contrato"("status");

-- CreateIndex
CREATE INDEX "Boleto_clienteId_status_vencimento_idx" ON "Boleto"("clienteId", "status", "vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "CacheData_chave_key" ON "CacheData"("chave");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
