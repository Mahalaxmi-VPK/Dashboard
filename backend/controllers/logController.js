const db = require("../db");

exports.getLogs = async (req, res) => {

    try {

        const [rows] = await db.query(`

            SELECT

                event_time,

                user_host,

                CAST(argument AS CHAR(1000)) AS query

            FROM mysql.general_log

            WHERE command_type='Query'

            ORDER BY event_time DESC

            LIMIT 300;

        `);

        const logs = [];

        rows.forEach(row => {

            const query = (row.query || "").trim().toUpperCase();

            // Ignore dashboard's own monitoring queries
            if (
                query.includes("MYSQL.GENERAL_LOG") ||
                query.includes("SHOW PROCESSLIST") ||
                query.includes("SHOW GLOBAL STATUS") ||
                query.includes("INFORMATION_SCHEMA")
            ) return;

            if (

                query.startsWith("SELECT") ||
                query.startsWith("INSERT") ||
                query.startsWith("UPDATE") ||
                query.startsWith("DELETE") ||
                query.startsWith("CREATE") ||
                query.startsWith("ALTER") ||
                query.startsWith("DROP") ||
                query.startsWith("TRUNCATE") ||
                query.startsWith("GRANT") ||
                query.startsWith("REVOKE")

            ) {

                logs.push({

                    time: row.event_time,

                    user: row.user_host,

                    event: query.split(" ")[0],

                    query: row.query

                });

            }

        });

        res.json(logs);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to fetch logs"
        });

    }

};