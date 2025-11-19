import { Router } from 'express';
import itemRouter from './itemRouter.js';

const router = Router();

router.use('/api/items', itemRouter);

export default router;

