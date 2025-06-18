import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';

// Define the type for a module registry entry
interface ModuleRegistryEntry {
  name: string;
  description: string;
  source: {
    type: string;
    packageName?: string; // For monorepoPackage
    // Other source types might have different properties
  };
  version: string;
}

const program = new Command();

program
  .name('ai-ecommerce')
  .description('CLI for ai-ecommerce')
  .version('1.0.0');

program
  .command('init')
  .description('Bootstrap a new e-commerce project')
  .action(() => {
    const dirs = ['src', 'src/modules', 'src/pages'];
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
  .description('Add a module or other entity')
  .action((type, name) => {
    if (type === 'module') {
      try {
        const registryPath = path.join(__dirname, 'module-registry.json');
        const registryContent = fs.readFileSync(registryPath, 'utf-8');
        const moduleRegistry: ModuleRegistryEntry[] = JSON.parse(registryContent);

        const moduleInfo = moduleRegistry.find(m => m.name === name);

        if (!moduleInfo) {
          console.error(`Module '${name}' not found in registry.`);
          process.exit(1);
        }

        if (moduleInfo.source.type === 'monorepoPackage' && moduleInfo.source.packageName) {
          // Construct source path assuming CLI is in packages/cli/dist (after build)
          // and modules are in packages/*
          // __dirname here would be packages/cli/dist/
          const packageNameParts = moduleInfo.source.packageName.split('/');
          const moduleDirName = packageNameParts.length > 1 ? packageNameParts[1] : packageNameParts[0];

          // Go up from packages/cli/dist (3 levels) to reach the monorepo root, then packages/<moduleDirName>
          const sourcePath = path.resolve(__dirname, '../../../packages', moduleDirName);
          const sourceSrcPath = path.join(sourcePath, 'src');

          const destPath = path.join(process.cwd(), 'src', 'modules', name);

          if (!fs.existsSync(sourceSrcPath)) {
            console.error(`Source directory ${sourceSrcPath} not found for module ${name}.`);
            console.error(`Attempted source path: ${sourcePath}`);
            console.error(`Ensure the module '${moduleInfo.source.packageName}' has a 'src' directory.`);
            process.exit(1);
          }

          fs.mkdirSync(destPath, { recursive: true });
          fsExtra.copySync(sourceSrcPath, destPath); // Copy contents of module's src to destPath

          console.log(`Module '${name}' (type: monorepoPackage) added successfully from ${moduleInfo.source.packageName} to ${destPath}.`);
          console.log(`Files copied from ${sourceSrcPath}.`);

        } else {
          console.error(`Unsupported source type '${moduleInfo.source.type}' for module '${name}'.`);
          process.exit(1);
        }

      } catch (error) {
        console.error(`Error adding module '${name}':`, error);
        process.exit(1);
      }
    } else {
      console.log(`Unknown type '${type}'. Currently, only 'module' type is supported.`);
    }
  });

program.parse(process.argv);
