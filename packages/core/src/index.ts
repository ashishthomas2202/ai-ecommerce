export interface Product<T extends Record<string, any> = Record<string, any>> {
  id: string;
  name: string;
  /**
   * Base price of the product. Specific pricing schemes (e.g. discounts)
   * can be represented via the `attributes` generic.
   */
  price: number;
  /**
   * Optional custom attributes for storing additional product data.
   */
  attributes?: T;
}

// New Product Attribute Interfaces

export interface DigitalProductAttributes {
  downloadLink: string;
  fileType?: string; // e.g., 'PDF', 'ZIP', 'MP4'
  licenseKey?: string;
}

export interface PhysicalProductAttributes {
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  shippingClass?: string; // e.g., 'standard', 'express', 'fragile'
}

export interface SubscriptionProductAttributes {
  billingInterval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  trialPeriodDays?: number;
  features: string[]; // List of features included in the subscription
}

export interface RentalProductAttributes {
  rentalPeriodDays: number;
  depositAmount?: number;
  availabilityStartDate: string; // ISO date string
  availabilityEndDate: string;   // ISO date string
}

// Example Usage (illustrative comments)
//
// type DigitalBook = Product<DigitalProductAttributes>;
// const ebook: DigitalBook = {
//   id: 'ebook123',
//   name: 'Learning TypeScript',
//   price: 29.99,
//   attributes: {
//     downloadLink: 'https://example.com/ebook.pdf',
//     fileType: 'PDF'
//   }
// };
//
// type PhysicalTShirt = Product<PhysicalProductAttributes>;
// const shirt: PhysicalTShirt = {
//   id: 'shirt789',
//   name: 'Cool Developer T-Shirt',
//   price: 25.00,
//   attributes: {
//     weightKg: 0.2,
//     dimensionsCm: { length: 70, width: 50, height: 2 },
//     shippingClass: 'standard'
//   }
// };
//
// type SoftwareSubscription = Product<SubscriptionProductAttributes>;
// const softwareSaas: SoftwareSubscription = {
//   id: 'saas001',
//   name: 'Pro Cloud Editor - Monthly',
//   price: 19.99,
//   attributes: {
//     billingInterval: 'monthly',
//     features: ['Unlimited Projects', 'Cloud Storage 10GB', 'Priority Support']
//   }
// };
//
// type CameraRental = Product<RentalProductAttributes>;
// const camera: CameraRental = {
//   id: 'rentalCam002',
//   name: 'Professional DSLR Camera',
//   price: 50.00, // Price per rental period
//   attributes: {
//     rentalPeriodDays: 3,
//     depositAmount: 100.00,
//     availabilityStartDate: '2024-01-01',
//     availabilityEndDate: '2024-12-31'
//   }
// };

export interface CartItem<T extends Record<string, any> = Record<string, any>> {
  product: Product<T>;
  quantity: number;
}

export class Cart<T extends Record<string, any> = Record<string, any>> {
  private items: CartItem<T>[] = [];

  addProduct(product: Product<T>, quantity = 1): void {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getItems(): CartItem<T>[] {
    return [...this.items];
  }
}

export function checkout<T extends Record<string, any>>(cart: Cart<T>): string {
  const total = cart.getTotal().toFixed(2);
  return `Checked out ${cart.getItems().length} items. Total: $${total}`;
}
