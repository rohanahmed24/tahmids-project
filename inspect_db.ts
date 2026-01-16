
import { getDb } from "./lib/db";
import { RowDataPacket } from "mysql2";

async function inspect() {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM posts LIMIT 1");
    if (rows.length > 0) {
        console.log("Post found:", rows[0]);
    } else {
        console.log("No post found with that slug.");
    }
    process.exit(0);
}

inspect().catch(console.error);
