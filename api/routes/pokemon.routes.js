import express from 'express';
import { getAllPokemon, getById, createPokemon, updatePokemon, deletePokemon } from '../controllers/pokemon.controller.js';
import { validateId, authenticate } from '../middlewares/common.middleware.js';
import { validatePokemon, validatePokemonUpdate } from '../middlewares/pokemon.middleware.js';

const router = express.Router();

router.get('/', getAllPokemon);
router.get('/:id', validateId, getById);

router.post('/', authenticate, validatePokemon, createPokemon);

router.patch('/:id', authenticate, validateId, validatePokemonUpdate, updatePokemon);

router.delete('/:id', authenticate, validateId, deletePokemon);

export default router;