import express from 'express';
import { getAllEquipe, getById, createEquipe, updateEquipe, deleteEquipe, addPokemonToEquipe, removePokemonFromEquipe } from '../controllers/equipe.controller.js';
import { validateId, authenticate } from '../middlewares/common.middleware.js';
import { validateEquipe, validateEquipeUpdate } from '../middlewares/equipe.middleware.js';

const router = express.Router();

router.get('/', getAllEquipe);

router.get('/:id', validateId, getById);

router.post('/', authenticate, validateEquipe, createEquipe);
router.post('/:id/pokemons/:pokemonId', authenticate, validateId, addPokemonToEquipe);


router.patch('/:id', authenticate, validateId, validateEquipeUpdate, updateEquipe);
router.delete('/:id', authenticate, validateId, deleteEquipe);
router.delete('/:id/pokemons/:pokemonId', authenticate, validateId, removePokemonFromEquipe);


export default router;