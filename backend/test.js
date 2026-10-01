const db = require("./db");

async function testConnection() {

    try {

       const [rows] = await db.query(`
SELECT
event_time,
command_type,
CAST(argument AS CHAR(1000)) AS query_text
FROM mysql.general_log
ORDER BY event_time DESC
LIMIT 5
`);

        console.log(rows);

        console.log("✅ MySQL Connected");

    } catch (err) {

        console.log(err);

    }

}

testConnection();