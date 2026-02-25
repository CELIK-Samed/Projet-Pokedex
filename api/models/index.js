import { sequelize } from "./sequelize.js";
import { Equipe } from "./equipe.model.js";
import { Pokemon } from "./pokemon.model.js";
import { Type } from "./type.model.js";
import { PokemonType } from "./pokemonType.model.js";
import { TeamPokemon } from "./teamPokemon.model.js";
import { User } from "./user.model.js";

// Pokémon <--> Type (Many-to-Many)
Pokemon.belongsToMany(Type, {
  as: "types",
  through: PokemonType,
  foreignKey: "pokemon_id"
});

Type.belongsToMany(Pokemon, {
  as: "pokemons",
  through: PokemonType,
  foreignKey: "type_id"
});

// Team <--> Pokémon (Many-to-Many)
Equipe.belongsToMany(Pokemon, {
  as: "pokemons",
  through: TeamPokemon,
  foreignKey: "team_id"
});

Pokemon.belongsToMany(Equipe, {
  as: "teams",
  through: TeamPokemon,
  foreignKey: "pokemon_id"
});

export { sequelize, Equipe, Pokemon, Type, PokemonType, TeamPokemon, User };