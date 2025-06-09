import { sequelize } from "../utils/database.js";

import userSchema from "./schema/userSchema.js";
import imageSchema from "./schema/utils/imageSchema.js";
import categorySchema from "./schema/categorySchema.js";
import productSchema from "./schema/productSchema.js";



export const User = sequelize.define("user", userSchema);
export const ImageCollection = sequelize.define("imageCollection", imageSchema);
export const Category = sequelize.define("category", categorySchema);
export const Product = sequelize.define("product", productSchema);


Category.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Category, { foreignKey: "user_id" });

Product.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Product, { foreignKey: "user_id" });

Product.belongsTo(Category, { foreignKey: "category_title", targetKey: "title" });
Category.hasMany(Product, { foreignKey: "category_title", sourceKey: "title" });
