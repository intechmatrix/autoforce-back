import { config } from "dotenv";
config();

export const dbUrl = process.env.DB_URL;
export const port = Number(process.env.PORT) || 3000;

export const apiVersion = process.env.API_VERSION;

export const secretKey = process.env.SECRET_KEY;
export const expireIn = process.env.EXPIRE_IN;

export const staticFolder = "./public";
