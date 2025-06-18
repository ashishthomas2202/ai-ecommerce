import { Router, Request, Response } from 'express';
import { Cart, Product, checkout as coreCheckout } from '@ai-ecommerce/core';

const router = Router();

// In-memory cart instance
// Let's use a 'let' so we can re-initialize it upon checkout
let cart = new Cart<any>();

// GET /cart - Retrieve cart contents and total
router.get('/', (req: Request, res: Response) => {
  res.json({
    items: cart.getItems(),
    total: cart.getTotal(),
  });
});

// POST /cart/items - Add an item to the cart
router.post('/items', (req: Request, res: Response) => {
  const { productId, name, price, quantity, attributes } = req.body;

  if (!productId || !name || typeof price !== 'number' || typeof quantity !== 'number') {
    return res.status(400).json({ message: 'Invalid request body. productId, name, price, and quantity are required.' });
  }
  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be positive.' });
  }

  const productToAdd: Product<any> = {
    id: productId,
    name,
    price,
    attributes: attributes || {}, // Include attributes if provided
  };

  cart.addProduct(productToAdd, quantity);
  res.json({
    items: cart.getItems(),
    total: cart.getTotal(),
  });
});

// DELETE /cart/items/:productId - Remove an item from the cart
router.delete('/items/:productId', (req: Request, res: Response) => {
  const { productId } = req.params;
  cart.removeProduct(productId);
  res.json({
    items: cart.getItems(),
    total: cart.getTotal(),
  });
});

// POST /cart/checkout - Process checkout
router.post('/checkout', (req: Request, res: Response) => {
  if (cart.getItems().length === 0) {
    return res.status(400).json({ message: 'Cannot checkout an empty cart.' });
  }
  const checkoutMessage = coreCheckout(cart);

  // Re-initialize the cart after checkout
  cart = new Cart<any>();

  res.json({
    message: checkoutMessage,
    cart: { // Send back the state of the new empty cart
      items: cart.getItems(),
      total: cart.getTotal()
    }
  });
});

export default router;
