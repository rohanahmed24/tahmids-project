
import { getDb } from "./lib/db";
import { RowDataPacket } from "mysql2";

async function inspect() {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM articles LIMIT 1");
    if (rows.length > 0) {
        console.log("Columns:", Object.keys(rows[0]));
        console.log("First row:", rows[0]);
    } else {
        console.log("No articles found.");
    }
    process.exit(0);
}

inspect().catch(console.error);
