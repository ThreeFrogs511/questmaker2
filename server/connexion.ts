
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
