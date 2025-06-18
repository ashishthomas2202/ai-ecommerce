# ai-ecommerce

This monorepo contains a minimal ecommerce core built with Prisma and an accompanying CLI.

## Packages
- **core**: exposes a factory to create a Prisma client using a SQLite database by default. Users can override the connection string.
- **cli**: exposes the `ai-ecommerce` command to add optional modules (`product`, `cart`, `checkout`) to a project.

## Usage
Install dependencies and run the CLI:

```bash
npm install
npx ai-ecommerce --db-url "file:./my.db" add product
```

Run the included tests:

```bash
npm test
```
