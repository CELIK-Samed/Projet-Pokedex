import { Equipe, Type, Pokemon } from "../models/index.js";

export async function getAllEquipe(req, res) {
  const equipes = await Equipe.findAll({
    order: [['id', 'ASC']]
  });
  res.status(200).json(equipes);
}

export async function getById(req, res) {
    const equipe = await Equipe.findByPk(req.params.id, {
        include: [
      {
        model: Pokemon,
        as: "pokemons",
        through: { attributes: []},
        attributes: ["id", "name", "hp", "atk", "def", "atk_spe", "def_spe", "speed"],
        include: [
          {
            model: Type,
            as: "types",
            attributes: ["id", "name", "color"]
          }
        ]
      }
    ]
  });
    if (!equipe) {
        return res.status(404).json({
            error: "Equipe non trouvée"
        });
    }
    res.status(200).json(equipe);
}

export async function createEquipe(req, res) {
    const equipe = await Equipe.create(req.body);
    res.status(201).json(equipe);
}

export async function updateEquipe(req, res) {
    const [updatedCount, updatedEquipe] = await Equipe.update(req.body, {
        where: {
            id: req.params.id
        },
        returning: true
    });
    if (updatedCount === 0) {
        return res.status(404).json({
            error: "Equipe non trouvée"
        });
    }
    res.status(200).json(updatedEquipe[0]); 
}

export async function deleteEquipe(req, res) {
    const deleteCount= await Equipe.destroy({
        where: {
            id: req.params.id
        }
    })
    if (deleteCount === 0) {
        return res.status(404).json({
            error: "Equipe non trouvée"
        });
    }
    res.status(200).json({
        message: "Equipe supprimée avec succès"
    });
}

export async function addPokemonToEquipe(req, res) {
  const equipe = await Equipe.findByPk(req.params.id);
  
  if (!equipe) {
    return res.status(404).json({
      error: "Équipe non trouvée"
    });
  }
  
  const pokemon = await Pokemon.findByPk(req.params.pokemonId);
  
  if (!pokemon) {
    return res.status(404).json({
      error: "Pokémon non trouvé"
    });
  }
  
  await equipe.addPokemon(pokemon);
  
  res.status(200).json({
    message: `${pokemon.name} a été ajouté à l'équipe ${equipe.name}`
  });
}

export async function removePokemonFromEquipe(req, res) {
  const equipe = await Equipe.findByPk(req.params.id);
  
  if (!equipe) {
    return res.status(404).json({
      error: "Équipe non trouvée"
    });
  }
  
  const pokemon = await Pokemon.findByPk(req.params.pokemonId);
  
  if (!pokemon) {
    return res.status(404).json({
      error: "Pokémon non trouvé"
    });
  }
  
  await equipe.removePokemon(pokemon);
  
  res.status(200).json({
    message: `${pokemon.name} a été retiré de l'équipe ${equipe.name}`
  });
}