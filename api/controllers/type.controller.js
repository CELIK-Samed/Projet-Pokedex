import { Type, Pokemon } from "../models/index.js";

export async function getAllTypes(req, res) {
  const types = await Type.findAll({
    order: [['id', 'ASC']]
  });
  res.status(200).json(types);
}

export async function getById(req, res) {
  const type = await Type.findByPk(req.params.id);
  
  if (!type) {
    return res.status(404).json({
      error: "Type non trouvé"
    });
  }
  
  res.status(200).json(type);
}

export async function getPokemonsByType(req, res) {
  const type = await Type.findByPk(req.params.id, {
    include: [
      {
        model: Pokemon,
        as: "pokemons",
        attributes: ["id", "name", "hp", "atk", "def", "atk_spe", "def_spe", "speed"]
      }
    ]
  });
  
  if (!type) {
    return res.status(404).json({
      error: "Type non trouvé"
    });
  }
  
  res.status(200).json(type);
}

export async function createType(req, res) {
  const type = await Type.create(req.body);
  res.status(201).json(type);
}

export async function updateType(req, res) {
  const [updatedCount, updatedType] = await Type.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true
  });
  
  if (updatedCount === 0) {
    return res.status(404).json({
      error: "Type non trouvé"
    });
  }
  
  res.status(200).json(updatedType[0]);
}

export async function deleteType(req, res) {
  const deleteCount = await Type.destroy({
    where: {
      id: req.params.id
    }
  });
  
  if (deleteCount === 0) {
    return res.status(404).json({
      error: "Type non trouvé"
    });
  }
  
  res.status(204).end();
}