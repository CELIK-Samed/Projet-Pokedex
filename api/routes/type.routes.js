import express from 'express';
import { getAllTypes, getById, createType, updateType, deleteType, getPokemonsByType } from '../controllers/type.controller.js';
import { validateId, authenticate } from '../middlewares/common.middleware.js';
import { validateType, validateTypeUpdate } from '../middlewares/type.middleware.js';

const router = express.Router();

router.get('/', getAllTypes);
router.get('/:id', validateId, getById);
router.get('/:id/pokemons', validateId, getPokemonsByType);

router.post('/', authenticate, validateType, createType);

router.patch('/:id', authenticate, validateId, validateTypeUpdate, updateType);

router.delete('/:id', authenticate, validateId, deleteType);
export default router;