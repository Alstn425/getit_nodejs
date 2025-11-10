import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  replaceUser,
  //updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/',      getAllUsers);    // GET    /users
router.get('/:id',   getUserById);    // GET    /users/:id
router.post('/',     createUser);     // POST   /users
router.put('/:id',   replaceUser);    // PUT    /users/:id
//router.patch('/:id', updateUser);     // PATCH  /users/:id
router.delete('/:id', deleteUser);    // DELETE /users/:id

export default router;
