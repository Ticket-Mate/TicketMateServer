import express from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user';

const router = express.Router();


router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
