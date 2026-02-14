require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function init() {
    try {
        console.log("Connecting to DB...");
        const client = await pool.connect();
        try {
            console.log("Registering GameKey: MEDCORE_HOSPITAL");
            await client.query(`ALTER TYPE "GameKey" ADD VALUE IF NOT EXISTS 'MEDCORE_HOSPITAL'`);
            console.log("Success!");
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await pool.end();
    }
}

init();
