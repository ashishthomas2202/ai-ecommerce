#!/usr/bin/env node
const { program } = require('commander')
const path = require('path')
const fs = require('fs')

program
  .name('ai-ecommerce')
  .description('AI Ecommerce CLI')

program
  .command('add <component>')
  .description('Add a component (product, cart, checkout)')
  .action((component) => {
    const src = path.join(__dirname, '../templates', component)
    if (!fs.existsSync(src)) {
      console.error(`Unknown component: ${component}`)
      process.exit(1)
    }
    const dest = process.cwd()
    fs.readdirSync(src).forEach(file => {
      const srcPath = path.join(src, file)
      const destPath = path.join(dest, file)
      if (fs.existsSync(destPath)) return
      fs.copyFileSync(srcPath, destPath)
    })
    console.log(`Added ${component} component`)
  })

program
  .option('--db-url <url>', 'database connection string')

program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts()
  if (opts.dbUrl) {
    process.env.DATABASE_URL = opts.dbUrl
  }
})

program.parse(process.argv)
