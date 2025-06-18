export interface Product<
  A extends Record<string, any> = Record<string, any>,
  Type extends string = string
> {
  /** Unique identifier of the product */
  id: string;
  /** Display name */
  name: string;
  /**
   * Base price of the product. Specific pricing schemes (e.g. discounts)
   * can be represented via custom attributes.
   */
  price: number;
  /** Optional product type/category */
  type?: Type;
  /**
   * Optional custom attributes for storing additional product data.
   */
  attributes?: A;
}

export interface CartItem<
  A extends Record<string, any> = Record<string, any>,
  Type extends string = string
> {
  product: Product<A, Type>;
  quantity: number;
}

export interface CartOptions<
  A extends Record<string, any> = Record<string, any>,
  Type extends string = string
> {
  /**
   * Function to resolve the price of a product. Defaults to using `price`.
   */
  getPrice?: (product: Product<A, Type>) => number;
  /**
   * Hook to decide if a product can be added. Allows restricting combinations.
   */
  allowAdd?: (items: CartItem<A, Type>[], product: Product<A, Type>) => boolean;
  /** Desired currency code. Used by consumers when formatting totals. */
  currency?: string;
  /** Optional tax calculator. Receives subtotal and items. */
  taxCalculator?: (subtotal: number, items: CartItem<A, Type>[]) => number;
  /** Optional persistence hook invoked on mutations. */
  persist?: (items: CartItem<A, Type>[]) => void;
  /** Inventory manager for stock checks and reservations. */
  inventoryManager?: {
    checkStock(productId: string, qty: number): boolean;
    reserveStock(productId: string, qty: number): void;
  };
}

export class Cart<
  A extends Record<string, any> = Record<string, any>,
  Type extends string = string
> {
  private items: CartItem<A, Type>[] = [];
  constructor(private options: CartOptions<A, Type> = {}) {}

  addProduct(product: Product<A, Type>, quantity = 1): void {
    if (this.options.allowAdd && !this.options.allowAdd(this.items, product)) {
      return;
    }
    if (
      this.options.inventoryManager &&
      !this.options.inventoryManager.checkStock(product.id, quantity)
    ) {
      return;
    }
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.options.persist?.(this.items);
    this.options.inventoryManager?.reserveStock(product.id, quantity);
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.options.persist?.(this.items);
  }

  getTotal(): number {
    const getPrice = this.options.getPrice ?? ((p: Product<A, Type>) => p.price);
    const subtotal = this.items.reduce(
      (sum, item) => sum + getPrice(item.product) * item.quantity,
      0
    );
    const tax = this.options.taxCalculator
      ? this.options.taxCalculator(subtotal, this.items)
      : 0;
    return subtotal + tax;
  }

  getItems(): CartItem<A, Type>[] {
    return [...this.items];
  }
}

export function checkout<
  A extends Record<string, any>,
  Type extends string
>(cart: Cart<A, Type>): string {
  const total = cart.getTotal().toFixed(2);
  const currency = cart['options']?.currency ?? 'USD';
  return `Checked out ${cart.getItems().length} items. Total: ${currency} ${total}`;
}
