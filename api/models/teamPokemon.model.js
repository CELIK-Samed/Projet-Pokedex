import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.js";

class TeamPokemon extends Model {}

TeamPokemon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pokemon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pokemon",
        key: "id"
      }
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "team",
        key: "id"
      }
    }
  },
  {
    sequelize,
    tableName: "team_pokemon",
    timestamps: false
  }
);

export { TeamPokemon };