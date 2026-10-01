const db = require("../db");

exports.getUsers = async (req, res) => {

    try {

        const [rows] = await db.query(`

            SELECT
                User,
                Host,
                account_locked,
                password_expired
            FROM mysql.user
            ORDER BY User;

        `);

        const users = rows.map(user => ({

            user: user.User,

            host: user.Host,

            status:
                user.account_locked === 'Y'
                    ? "Locked"
                    : "Unlocked",

            password:
                user.password_expired === 'Y'
                    ? "Expired"
                    : "Valid"

        }));

        res.json(users);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Failed to fetch users"
        });

    }

};