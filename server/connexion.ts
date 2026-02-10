// import postgres from 'postgres';



// export const sql = postgres({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
//   // ssl: "require",
// });


import postgres from "postgres";

const url = process.env.DATABASE_URL!;
const isLocalDocker = url.includes("@db:5432/");

export const sql = postgres(url, {
  ssl: isLocalDocker ? false : "require",
});
