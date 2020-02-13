const express = require("express");

const app = express();

const publicRouter = require("./routes/index");
const apiRouter = require("./api/index");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/", apiRouter);

app.use("/", publicRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server started"))