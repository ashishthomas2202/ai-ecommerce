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
