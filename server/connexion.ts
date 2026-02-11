// import postgres from 'postgres';



// export const sql = postgres({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
//   // ssl: "require",
// });


// import postgres from "postgres";

// const url = process.env.DATABASE_URL;

// if (!url) {
//   throw new Error("DATABASE_URL is missing (needed for server/connexion).");
// }

// const isLocalDocker = url.includes("@db:5432/");

// export const sql = postgres(url, {
//   ssl: isLocalDocker ? false : "require",
// });


import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing");

const isLocal =
  url.includes("@db:5432/") ||
  url.includes("@localhost:5432/") ||
  url.includes("@127.0.0.1:5432/");

export const sql = postgres(url, {
  ssl: isLocal ? false : "require",
});
