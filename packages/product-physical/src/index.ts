import { Product, PhysicalProductAttributes } from '@ai-ecommerce/core';

// Define a specialized product type for Physical Products
export type PhysicalProduct = Product<PhysicalProductAttributes>;

// Example utility function for this module
export function getShippingWeightKg(product: PhysicalProduct): number | null {
  if (product.attributes) {
    return product.attributes.weightKg;
  }
  return null;
}

// Export the attributes interface
export { PhysicalProductAttributes };

console.log('Physical product module loaded'); // For basic testing
