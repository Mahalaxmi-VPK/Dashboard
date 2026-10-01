const alertService = require("../services/alertService");


exports.getAlerts = async (req, res) => {

    try {

        const alerts = await alertService.getAlerts();

        res.json(alerts);

    } catch (error) {

        console.error("Alert Controller Error:", error);

        res.status(500).json({

            message: "Unable to fetch security alerts",

            error: error.message

        });

    }

};