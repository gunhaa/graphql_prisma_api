import dotenv from "dotenv";

dotenv.config();

dotenv.config()

export const config = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4567,
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_1q2w3e4r',
  PROJECT_TYPE: process.env.NODE_ENV,
}
