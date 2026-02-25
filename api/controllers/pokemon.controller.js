import { Pokemon, Type } from "../models/index.js";

export async function getAllPokemon(req, res) {
  const pokemons = await Pokemon.findAll({
    include: [
      {
        model: Type,
        as: "types",
        attributes: ["id", "name", "color"]
      }
    ]
  });
  res.status(200).json(pokemons);
}

export async function getById(req, res) {
  const pokemon = await Pokemon.findByPk(req.params.id, {
    include: [
      {
        model: Type,
        as: "types",
        attributes: ["id", "name", "color"]
      }
    ]
  });
  if (!pokemon) {
    return res.status(404).json({
      error: "Pokémon non trouvé"
    });
  }
  res.status(200).json(pokemon);
}

export async function createPokemon(req, res) {
  const pokemon = await Pokemon.create(req.body);
  res.status(201).json(pokemon);
}

export async function updatePokemon(req, res) {
  const [updatedCount, updatedPokemon] = await Pokemon.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true
  });
  if (updatedCount === 0) {
    return res.status(404).json({
      error: "Pokémon non trouvé"
    });
  }
  res.status(200).json(updatedPokemon[0]);
}

export async function deletePokemon(req, res) {
  const deleteCount = await Pokemon.destroy({
    where: {
      id: req.params.id
    }
  });
  if (deleteCount === 0) {
    return res.status(404).json({
      error: "Pokémon non trouvé"
    });
  }
  res.status(204).end();
}