import { config } from "dotenv";
import { Sequelize } from "sequelize";
config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      connectTimeout: 10000, // Increase connection timeout to 10 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to Database");
  } catch (err) {
    console.log(err);
  }
};

export { sequelize, connectToDB };
