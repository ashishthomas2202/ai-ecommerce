# ai-ecommerce

This monorepo contains reusable e-commerce logic and a CLI.

## Packages

- `@ai-ecommerce/core` – cart and checkout utilities
- `ai-ecommerce` – command line interface

## Usage

Build packages:

```bash
npm install
npm run build
```

Initialize a new project:

```bash
npx ai-ecommerce init
```

Add a module:

```bash
npx ai-ecommerce add module MyModule
```


### Custom product attributes

The `Product` interface in `@ai-ecommerce/core` accepts a generic parameter
for custom attributes. This lets you add fields such as `salePrice` or
color without changing the library:

```ts
import { Product } from '@ai-ecommerce/core';

interface ShoeAttrs {
  color: string;
  salePrice?: number;
}

const shoe: Product<ShoeAttrs> = {
  id: 'shoe-1',
  name: 'Sneaker',
  price: 79.99,
  attributes: { color: 'red', salePrice: 59.99 }
};
```

