import express from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getAllProducts);        // GET /products
productRouter.get('/:id', getProductById);     // GET /products/:id

export default productRouter;
