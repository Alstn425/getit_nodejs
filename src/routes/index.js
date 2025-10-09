import express from 'express';
import userRouter from './users.js';
import productRouter from './productRouter.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
// 다른 라우터를 추가할 수 있습니다.

export default router;