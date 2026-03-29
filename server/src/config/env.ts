import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL,
  PASETO_SECRET: process.env.PASETO_SECRET,
  ELASTIC_URL: process.env.ELASTIC_URL,
  MONGO_URI: process.env.MONGO_URI,
  DATABASE_URL: process.env.DATABASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  BACKEND_URL:process.env.BACKEND_URL
};
