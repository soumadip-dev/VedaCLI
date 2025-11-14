import dotenv from 'dotenv';
dotenv.config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default ENV;
