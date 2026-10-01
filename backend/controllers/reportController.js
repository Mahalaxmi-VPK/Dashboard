const db = require("../db");


/*
===========================================================
GET REPORT DATA
===========================================================
*/

async function generateReport(days) {

    const [rows] = await db.query(
        `
        SELECT
            event_time,
            user_host,
            command_type,
            CAST(argument AS CHAR(2000)) AS query_text
        FROM mysql.general_log
        WHERE
            command_type = 'Query'
            AND event_time >= NOW() - INTERVAL ? DAY
        ORDER BY event_time DESC
        `,
        [days]
    );


    /*
    =======================================================
    QUERY COUNTS
    =======================================================
    */

    const queryActivity = {

        SELECT: 0,
        INSERT: 0,
        UPDATE: 0,
        DELETE: 0,
        CREATE: 0,
        ALTER: 0,
        DROP: 0,
        TRUNCATE: 0,
        GRANT: 0,
        REVOKE: 0

    };


    /*
    =======================================================
    SECURITY ALERT COUNTS
    =======================================================
    */

    let critical = 0;
    let high = 0;
    let medium = 0;


    /*
    =======================================================
    PROCESS LOGS
    =======================================================
    */

    rows.forEach(row => {

        const query =
            (row.query_text || "")
                .trim()
                .replace(/\s+/g, " ");

        const upper =
            query.toUpperCase();


        /*
        Ignore DB Guardian's own monitoring queries
        */

        if (

            upper.includes("MYSQL.GENERAL_LOG") ||

            upper.includes("SHOW PROCESSLIST") ||

            upper.includes("SHOW GLOBAL STATUS") ||

            upper.includes("INFORMATION_SCHEMA") ||

            upper.includes("PERFORMANCE_SCHEMA")

        ) {

            return;

        }


        /*
        ===================================================
        QUERY TYPE
        ===================================================
        */

        let action = null;


        if (upper.startsWith("SELECT")) {

            action = "SELECT";

        }

        else if (upper.startsWith("INSERT")) {

            action = "INSERT";

        }

        else if (upper.startsWith("UPDATE")) {

            action = "UPDATE";

        }

        else if (upper.startsWith("DELETE")) {

            action = "DELETE";

        }

        else if (upper.startsWith("CREATE")) {

            action = "CREATE";

        }

        else if (upper.startsWith("ALTER")) {

            action = "ALTER";

        }

        else if (upper.startsWith("DROP")) {

            action = "DROP";

        }

        else if (upper.startsWith("TRUNCATE")) {

            action = "TRUNCATE";

        }

        else if (upper.startsWith("GRANT")) {

            action = "GRANT";

        }

        else if (upper.startsWith("REVOKE")) {

            action = "REVOKE";

        }


        /*
        ===================================================
        COUNT QUERY
        ===================================================
        */

        if (
            action &&
            queryActivity[action] !== undefined
        ) {

            queryActivity[action]++;

        }


        /*
        ===================================================
        SECURITY SEVERITY
        ===================================================
        */

        if (

            upper.startsWith("DROP DATABASE") ||
            upper.startsWith("DROP SCHEMA") ||
            upper.startsWith("DROP TABLE") ||
            upper.startsWith("DROP USER") ||
            upper.startsWith("TRUNCATE TABLE") ||
            upper.startsWith("CREATE USER")

        ) {

            critical++;

        }


        else if (

            upper.startsWith("ALTER TABLE") ||
            upper.startsWith("ALTER DATABASE") ||
            upper.startsWith("ALTER USER") ||
            upper.startsWith("GRANT ") ||
            upper.startsWith("REVOKE ") ||
            upper.startsWith("RENAME TABLE") ||
            upper.startsWith("RENAME USER") ||
            upper.startsWith("SET PASSWORD")

        ) {

            high++;

        }


        else if (

            upper.startsWith("DELETE FROM") ||
            upper.startsWith("UPDATE ") ||
            upper.startsWith("CREATE TABLE") ||
            upper.startsWith("CREATE DATABASE") ||
            upper.startsWith("CREATE SCHEMA") ||
            upper.startsWith("CREATE INDEX")

        ) {

            medium++;

        }

    });


    /*
    =======================================================
    TOTAL ALERTS
    =======================================================
    */

    const totalAlerts =
        critical +
        high +
        medium;


    /*
    =======================================================
    REPORT
    =======================================================
    */

    return {

        reportPeriod: days === 1
            ? "Daily"
            : days === 7
                ? "Weekly"
                : "Monthly",

        periodInDays: days,

        generatedAt: new Date(),

        totalQueries: rows.length,

        totalAlerts,

        criticalAlerts: critical,

        highAlerts: high,

        mediumAlerts: medium,

        queryActivity,

        riskDistribution: [

            {
                name: "Critical",
                value: critical
            },

            {
                name: "High",
                value: high
            },

            {
                name: "Medium",
                value: medium
            }

        ]

    };

}


/*
===========================================================
DAILY
===========================================================
*/

exports.getDailyReport = async (req, res) => {

    try {

        const report =
            await generateReport(1);

        res.json(report);

    } catch (error) {

        console.error(
            "Daily report error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to generate daily report",

            error:
                error.message

        });

    }

};


/*
===========================================================
WEEKLY
===========================================================
*/

exports.getWeeklyReport = async (req, res) => {

    try {

        const report =
            await generateReport(7);

        res.json(report);

    } catch (error) {

        console.error(
            "Weekly report error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to generate weekly report",

            error:
                error.message

        });

    }

};


/*
===========================================================
MONTHLY
===========================================================
*/

exports.getMonthlyReport = async (req, res) => {

    try {

        const report =
            await generateReport(30);

        res.json(report);

    } catch (error) {

        console.error(
            "Monthly report error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to generate monthly report",

            error:
                error.message

        });

    }

};