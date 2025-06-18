const { PrismaClient } = require('@prisma/client')
const path = require('path')

function createClient(options = {}) {
  const databaseUrl = options.databaseUrl || process.env.DATABASE_URL || `file:${path.join(__dirname, '../prisma/dev.db')}`
  process.env.DATABASE_URL = databaseUrl
  return new PrismaClient()
}

module.exports = { createClient }
