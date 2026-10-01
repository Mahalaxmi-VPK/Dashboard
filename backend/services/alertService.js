const db = require("../db");


/*
===========================================================
DETECT SECURITY ALERT
===========================================================
*/

function detectAlert(query) {

    if (!query) return null;


    const normalized =
        query
            .trim()
            .replace(/\s+/g, " ");


    const upper =
        normalized.toUpperCase();


    /*
    =======================================================
    IGNORE DB GUARDIAN'S OWN QUERIES
    =======================================================
    */

    if (
        upper.includes("MYSQL.GENERAL_LOG") ||
        upper.includes("SHOW PROCESSLIST") ||
        upper.includes("SHOW GLOBAL STATUS") ||
        upper.includes("INFORMATION_SCHEMA") ||
        upper.includes("PERFORMANCE_SCHEMA")
    ) {

        return null;

    }


    /*
    =======================================================
    CRITICAL
    =======================================================
    */

    if (
        upper.startsWith("DROP DATABASE") ||
        upper.startsWith("DROP SCHEMA") ||
        upper.startsWith("DROP TABLE") ||
        upper.startsWith("DROP USER") ||
        upper.startsWith("TRUNCATE TABLE") ||
        upper.startsWith("CREATE USER")
    ) {

        return {

            severity: "Critical",

            type: "Destructive Operation"

        };

    }


    /*
    =======================================================
    HIGH
    =======================================================
    */

    if (
        upper.startsWith("ALTER TABLE") ||
        upper.startsWith("ALTER DATABASE") ||
        upper.startsWith("ALTER USER") ||
        upper.startsWith("GRANT ") ||
        upper.startsWith("REVOKE ") ||
        upper.startsWith("RENAME TABLE") ||
        upper.startsWith("RENAME USER") ||
        upper.startsWith("SET PASSWORD")
    ) {

        return {

            severity: "High",

            type: "Privilege / Schema Change"

        };

    }


    /*
    =======================================================
    MEDIUM - DATA MODIFICATION
    =======================================================
    */

    if (
        upper.startsWith("DELETE FROM") ||
        upper.startsWith("UPDATE ")
    ) {

        return {

            severity: "Medium",

            type: "Data Modification"

        };

    }


    /*
    =======================================================
    MEDIUM - DATABASE STRUCTURE
    =======================================================
    */

    if (
        upper.startsWith("CREATE TABLE") ||
        upper.startsWith("CREATE DATABASE") ||
        upper.startsWith("CREATE SCHEMA") ||
        upper.startsWith("CREATE INDEX")
    ) {

        return {

            severity: "Medium",

            type: "Database Structure Change"

        };

    }


    /*
    =======================================================
    NO SECURITY ALERT
    =======================================================
    */

    return null;

}


/*
===========================================================
GET SECURITY ALERTS
===========================================================
*/

async function getAlerts() {

    try {

        const [rows] = await db.query(`

            SELECT

                event_time,

                user_host,

                command_type,

                CAST(
                    argument AS CHAR(2000)
                ) AS query_text

            FROM mysql.general_log

            WHERE command_type = 'Query'

            ORDER BY event_time DESC

            LIMIT 500

        `);


        const alerts = [];


        /*
        ===================================================
        PROCESS LOG ENTRIES
        ===================================================
        */

        rows.forEach((row) => {


            const query =
                (row.query_text || "")
                    .trim()
                    .replace(/\s+/g, " ");


            const detected =
                detectAlert(query);


            /*
            No security issue
            */

            if (!detected) {

                return;

            }


            /*
            =================================================
            STABLE ALERT ID
            =================================================

            IMPORTANT:

            Do NOT use array index.

            The index changes whenever new queries
            appear in the log.

            Instead we create the ID from the actual
            database event.
            */

            const eventTime =
                new Date(
                    row.event_time
                ).getTime();


            const user =
                row.user_host ||
                "Unknown";


            const id =
                `${eventTime}-${user}-${query}`;


            /*
            =================================================
            CREATE ALERT
            =================================================
            */

            alerts.push({

                id,

                severity:
                    detected.severity,

                type:
                    detected.type,

                user,

                event:
                    query,

                time:
                    row.event_time

            });

        });


        /*
        ===================================================
        NEWEST FIRST
        ===================================================
        */

        alerts.sort((a, b) => {

            return (
                new Date(b.time).getTime() -
                new Date(a.time).getTime()
            );

        });


        return alerts;


    } catch (error) {

        console.error(
            "Get alerts error:",
            error.message
        );


        return [];

    }

}


/*
===========================================================
EXPORT
===========================================================
*/

module.exports = {

    detectAlert,

    getAlerts

};