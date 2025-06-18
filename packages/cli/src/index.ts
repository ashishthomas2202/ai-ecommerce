import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('ai-ecommerce')
  .description('CLI for ai-ecommerce')
  .version('1.0.0');

program
  .command('init')
  .description('Bootstrap a new e-commerce project')
  .action(() => {
    const dirs = ['src', 'src/components', 'src/pages'];
    dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));
    if (!fs.existsSync('package.json')) {
      const pkg = {
        name: 'ecommerce-app',
        version: '1.0.0',
        private: true,
        dependencies: {
          '@ai-ecommerce/core': 'workspace:*'
        }
      };
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    }
    if (!fs.existsSync('src/index.ts')) {
      fs.writeFileSync('src/index.ts', "console.log('Hello ai-ecommerce');\n");
    }
    console.log('Project initialized.');
  });

program
  .command('add <type> <name>')
  .description('Add a component or other entity')
  .action((type, name) => {
    if (type === 'component') {
      const dir = path.join('src', 'components');
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${name}.ts`);
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, `export const ${name} = () => {\n  // TODO: implement\n};\n`);
        console.log(`Component ${name} created.`);
      } else {
        console.log(`Component ${name} already exists.`);
      }
    } else {
      console.log(`Unknown type ${type}`);
    }
  });

program.parse(process.argv);
