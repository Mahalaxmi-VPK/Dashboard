const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const dashboardRoute = require("./routes/dashboard");
const alertRoute = require("./routes/alerts");
const userRoute = require("./routes/users");
const logRoute = require("./routes/logs");
const reportRoutes = require("./routes/reportRoutes");

app.use("/reports", reportRoutes);
app.use("/dashboard", dashboardRoute);

app.use("/alerts", alertRoute);

app.use("/users", userRoute);

app.use("/logs", logRoute);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});