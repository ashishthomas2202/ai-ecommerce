import { Product, DigitalProductAttributes } from '@ai-ecommerce/core';

// Define a specialized product type for Digital Products
export type DigitalProduct = Product<DigitalProductAttributes>;

// Example utility function for this module
export function getProductDownloadLink(product: DigitalProduct): string | null {
  if (product.attributes && product.attributes.downloadLink) {
    return product.attributes.downloadLink;
  }
  return null;
}

// You could also export the attributes interface if users of this module need to construct them
export { DigitalProductAttributes };

console.log('Digital product module loaded'); // For basic testing
