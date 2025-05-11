import dotenv from 'dotenv';

dotenv.config();
const DEFAULT_PORT = 4567;

console.log(`config DATABASE_URL: ${process.env.DATABASE_URL}`);

export const config = {
  PORT: process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT,
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_1q2w3e4r',
  PROJECT_TYPE: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
};
