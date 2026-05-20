import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // On Cloudflare Workers/Pages, D1 is available via process.env
  const d1Database = (process.env as any).D1_DATABASE as D1Database | undefined
  
  if (d1Database) {
    const adapter = new PrismaD1(d1Database)
    return new PrismaClient({ adapter })
  }
  
  // Local development: use regular SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
