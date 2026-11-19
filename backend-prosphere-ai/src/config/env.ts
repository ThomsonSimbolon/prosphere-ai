import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '8000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/prosphere_ai',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
