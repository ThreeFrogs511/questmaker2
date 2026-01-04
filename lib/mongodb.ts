// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI missing");

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
  }

  // connect() est idempotent : si déjà connecté, ça ne reconnecte pas
  await client.connect();

  db = client.db(process.env.MONGODB_DB);
  return db;
}
