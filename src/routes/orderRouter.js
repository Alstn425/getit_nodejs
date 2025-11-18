import express from 'express';
import {
	getAllOrders,
	createOrder,
	getJoinedOrders,
	getUserOrders,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get('/', getAllOrders); // GET /orders
orderRouter.post('/', createOrder); // POST /orders
orderRouter.get('/joined', getJoinedOrders); // GET /orders/joined
orderRouter.get('/user/:userId', getUserOrders); // GET /orders/user/:userId

export default orderRouter;
