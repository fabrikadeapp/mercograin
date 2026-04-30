/**
 * Test Investing.com Scraping (Standalone)
 * Não precisa de banco de dados ou Redis
 */

const https = require('https');

function testInvestingCom() {
  console.log('🌐 Testando scraping Investing.com...\n');

  const options = {
    hostname: 'br.investing.com',
    path: '/currencies/usd-brl',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        // Buscar padrão "5,XX" ou "5.XX"
        const match = data.match(/(\d+,\d{2})\s*BRL/);

        if (match) {
          const rate = parseFloat(match[1].replace(',', '.'));
          console.log('✅ Taxa USD/BRL encontrada:');
          console.log(`   ${rate}`);
          console.log(`   Timestamp: ${new Date().toLocaleString('pt-BR')}`);
          console.log('\n✅ Investing.com scraping FUNCIONANDO!');
        } else {
          console.log('⚠️  Taxa não encontrada no HTML');
          console.log('💡 Seletor CSS pode ter mudado em investing.com');
          console.log('💡 Será necessário atualizar lib/investing-client.ts');
        }
      } catch (error) {
        console.error('❌ Erro ao processar:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    console.log('\n💡 Possíveis causas:');
    console.log('   - Sem conexão com internet');
    console.log('   - Firewall bloqueando br.investing.com');
    console.log('   - Timeout na requisição');
  });

  req.end();
}

testInvestingCom();
