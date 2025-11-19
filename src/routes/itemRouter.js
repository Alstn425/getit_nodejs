import { Router } from 'express';
import {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';

const itemRouter = Router();

itemRouter.post('/', createItem);
itemRouter.get('/', listItems);
itemRouter.get('/:id', getItem);
itemRouter.put('/:id', updateItem);
itemRouter.delete('/:id', deleteItem);

export default itemRouter;
