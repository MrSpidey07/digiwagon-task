import { Sequelize, DataTypes } from "sequelize";
import config from "../config/database.js";
import UserModel from "./User.js";
import ProductModel from "./Product.js";
import VariantModel from "./Variant.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = UserModel(sequelize, DataTypes);
db.Product = ProductModel(sequelize, DataTypes);
db.Variant = VariantModel(sequelize, DataTypes);

// Define associations
db.User.hasMany(db.Product, { foreignKey: "userId", as: "products" });
db.Product.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Product.hasMany(db.Variant, {
  foreignKey: "productId",
  as: "variants",
  onDelete: "CASCADE",
});
db.Variant.belongsTo(db.Product, { foreignKey: "productId", as: "product" });

export default db;
export const { User, Product, Variant } = db;
export { sequelize, Sequelize };
