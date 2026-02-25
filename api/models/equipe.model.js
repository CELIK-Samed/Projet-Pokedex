import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.js";

class Equipe extends Model {}

Equipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "team",
    timestamps: false
  }
);

export { Equipe };