/**
 * redis.ts
 * Cliente Redis para cache
 */

import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

let redis: Redis

if (process.env.NODE_ENV === 'production') {
  redis = new Redis(redisUrl)
} else {
  // Em desenvolvimento, reutilizar conexão global
  const global = globalThis as any
  if (!global.redis) {
    global.redis = new Redis(redisUrl)
  }
  redis = global.redis
}

redis.on('error', (err) => {
  console.error('[Redis] Erro:', err)
})

redis.on('connect', () => {
  console.log('[Redis] Conectado')
})

export { redis }
