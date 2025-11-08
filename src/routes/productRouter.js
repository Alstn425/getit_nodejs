import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProductPut,
    updateProductPatch,
    deleteProduct
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);

productRouter.post('/', createProduct);
productRouter.put('/:id', updateProductPut);
productRouter.patch('/:id', updateProductPatch);
productRouter.delete('/:id', deleteProduct);

export default productRouter;


