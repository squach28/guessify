import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

export const commitTransaction = async (db, query, parameters) => {
  try {
    await db.query("COMMIT");
    const result = await db.query(query, parameters);
    return result;
  } catch (e) {
    console.log(e);
    await db.query("ROLLBACK");
  }
};
