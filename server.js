const express = require("express");

const app = express();

const publicRouter = require("./routes/index");
const apiRouter = require("./api/index");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/", apiRouter);


// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/dist"));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
    })
}

app.use("/", publicRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server started"))