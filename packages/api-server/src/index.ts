import express, { Request, Response } from 'express';
// import { Product } from '@ai-ecommerce/core'; // Will be used later
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req: Request, res: Response) => {
  res.send('AI E-commerce API Server is running!');
});

// Example: In-memory data store (temporary)
// let products: Product<any>[] = [];

// Mount product routes
app.use('/products', productRoutes);

// Mount cart routes
app.use('/cart', cartRoutes);

app.listen(port, () => {
  console.log(`API Server listening on port ${port}`);
});
