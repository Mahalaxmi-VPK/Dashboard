const monitoringService = require("../services/monitoringService");

exports.getDashboard = async (req, res) => {

    try {

        const dashboard = await monitoringService.getDashboardData();

        res.json(dashboard);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};