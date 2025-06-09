import { DataTypes } from "sequelize";

const imageSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  
      },
  localurl: {
    type: DataTypes.STRING,
    

  },
  imageurl: {
    type: DataTypes.STRING,
   

  },
};

export default imageSchema;
