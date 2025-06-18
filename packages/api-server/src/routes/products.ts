import { Router, Request, Response } from 'express';
// Assuming Prisma Client would be generated here if 'prisma generate' was successful
// import { PrismaClient, Product } from '@prisma/client';
// For now, to avoid type errors during linting/compilation if @prisma/client is missing,
// we might have to be creative or accept type errors if the environment cannot provide the client.
// Let's proceed as if PrismaClient is available.
import { PrismaClient } from '@prisma/client';


const router = Router();
const prisma = new PrismaClient();

// GET /products - Retrieve all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// POST /products - Create a new product
router.post('/', async (req: Request, res: Response) => {
  const { name, price, attributes } = req.body;

  if (!name || typeof price !== 'number') {
    return res.status(400).json({ message: 'Invalid product data. Name (string) and price (number) are required.' });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        attributes: attributes || {}, // Ensure attributes is at least an empty object if not provided
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// GET /products/:id - Retrieve a single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    res.status(500).json({ message: `Error fetching product with id ${id}` });
  }
});

export default router;
