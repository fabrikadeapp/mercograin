/**
 * investing-client.ts
 * Integração com Investing.com para scraping de dados
 * - Taxa de câmbio USD/BRL
 * - Preços complementares
 * - Dados em tempo real
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { redis } from './redis'

const INVESTING_COM_BASE = 'https://br.investing.com'

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://br.investing.com/'
}

/**
 * Busca taxa de câmbio USD/BRL do Investing.com
 */
export async function getExchangeRate(): Promise<number | null> {
  try {
    // Verificar cache primeiro
    const cached = await redis.get('usd-brl-rate')
    if (cached) {
      console.log('[Investing] Taxa USD/BRL do cache:', cached)
      return parseFloat(cached)
    }

    console.log('[Investing] Buscando taxa USD/BRL...')

    const response = await axios.get(`${INVESTING_COM_BASE}/currencies/usd-brl`, {
      headers,
      timeout: 10000
    })

    const $ = cheerio.load(response.data)

    // Selectores para a taxa de câmbio (pode mudar com o tempo)
    // Tentamos múltiplos seletores
    let rate: string | null = null

    // Tentativa 1: Preço principal
    rate = $('[data-test="instrument-header-current-price"]')?.text()?.trim()

    // Tentativa 2: Se não encontrou, procura em outro lugar
    if (!rate) {
      rate = $('[data-symbol="USDBRL"]').find('.text-lg')?.text()?.trim()
    }

    // Tentativa 3: Fallback genérico (qualquer elemento com número grande em reais)
    if (!rate) {
      const allText = $.text()
      const match = allText.match(/(\d+,\d{2})\s*BRL/)
      if (match) {
        rate = match[1]
      }
    }

    if (rate) {
      // Converter "5,45" para 5.45
      const normalized = parseFloat(rate.replace(',', '.'))

      if (normalized > 0) {
        // Cache por 1 hora
        await redis.setex(
          'usd-brl-rate',
          3600,
          normalized.toString()
        )

        console.log(`[Investing] Taxa USD/BRL obtida: ${normalized}`)
        return normalized
      }
    }

    console.warn('[Investing] Não conseguiu extrair taxa de câmbio')
    return null
  } catch (error) {
    console.error('[Investing] Erro ao buscar taxa USD/BRL:', error)
    return null
  }
}

/**
 * Busca preço do ouro (complementar)
 */
export async function getGoldPrice(): Promise<number | null> {
  try {
    const cached = await redis.get('gold-price-usd')
    if (cached) return parseFloat(cached)

    const response = await axios.get(`${INVESTING_COM_BASE}/commodities/gold`, {
      headers,
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const price = $('[data-test="instrument-header-current-price"]')?.text()?.trim()

    if (price) {
      const normalized = parseFloat(price.replace(',', '.'))
      if (normalized > 0) {
        await redis.setex('gold-price-usd', 3600, normalized.toString())
        return normalized
      }
    }

    return null
  } catch (error) {
    console.error('[Investing] Erro ao buscar preço do ouro:', error)
    return null
  }
}

/**
 * Busca preço do petróleo (complementar)
 */
export async function getOilPrice(): Promise<number | null> {
  try {
    const cached = await redis.get('oil-price-usd')
    if (cached) return parseFloat(cached)

    const response = await axios.get(`${INVESTING_COM_BASE}/commodities/crude-oil`, {
      headers,
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const price = $('[data-test="instrument-header-current-price"]')?.text()?.trim()

    if (price) {
      const normalized = parseFloat(price.replace(',', '.'))
      if (normalized > 0) {
        await redis.setex('oil-price-usd', 3600, normalized.toString())
        return normalized
      }
    }

    return null
  } catch (error) {
    console.error('[Investing] Erro ao buscar preço do petróleo:', error)
    return null
  }
}

/**
 * Busca múltiplos dados do Investing.com de uma vez
 */
export async function getInvestingData() {
  try {
    const [usdBrl, gold, oil] = await Promise.all([
      getExchangeRate(),
      getGoldPrice(),
      getOilPrice()
    ])

    return {
      usdBrl: usdBrl || 0,
      gold: gold || 0,
      oil: oil || 0,
      timestamp: new Date(),
      sucesso: usdBrl !== null
    }
  } catch (error) {
    console.error('[Investing] Erro ao buscar dados:', error)
    return {
      usdBrl: 0,
      gold: 0,
      oil: 0,
      timestamp: new Date(),
      sucesso: false
    }
  }
}

/**
 * Atualiza cache de dados do Investing.com (para usar em cron jobs)
 */
export async function updateInvestingCache() {
  console.log('[Investing] Atualizando cache...')
  const data = await getInvestingData()

  if (data.sucesso) {
    console.log('[Investing] Cache atualizado com sucesso')
  } else {
    console.warn('[Investing] Cache atualizado com dados parciais')
  }

  return data
}
