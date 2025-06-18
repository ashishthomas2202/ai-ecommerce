const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-ecom-'));
execSync(`node ${path.join(__dirname, '../bin/ai-ecommerce.js')} add product`, { cwd: tmp });
if (!fs.existsSync(path.join(tmp, 'index.js'))) {
  throw new Error('file not copied');
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log('cli test passed');
