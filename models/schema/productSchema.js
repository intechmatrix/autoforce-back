import { DataTypes } from "sequelize";

import userSchema from "./userSchema.js";
import categorySchema from "./categorySchema.js";

const productSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  slug: {
     type: DataTypes.STRING,
      allowNull: false,
       unique: true,
     },
     
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  highlights: {
    type: DataTypes.TEXT,
    allowNull: true,
  },


  category_title: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: categorySchema,
      key: "title",
    },
    },
  
    
  photo_1: {
    type: DataTypes.STRING,  
    allowNull: true,
  },

  photo_2: {
    type: DataTypes.STRING,  
    allowNull: true,
  },

  photo_3: {
    type: DataTypes.STRING,  
    allowNull: true,
  },

  photo_4: {
    type: DataTypes.STRING,  
    allowNull: true,
  },

  photo_5: {
    type: DataTypes.STRING,  
    allowNull: true,
  },

  videolink: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  price: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: userSchema,
      key: "id",
    },
    },
  
};

export default productSchema;
