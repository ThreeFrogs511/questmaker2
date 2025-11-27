import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();


export const sql = postgres({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});


// export const sql = postgres({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'clara1403',
//   database: 'questmaker',
//   port: 5432
// });
