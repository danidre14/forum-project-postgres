const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");

const postsRoute = require("./posts");
const commentsRoute = require("./comments");

router.use("/posts/", postsRoute);
router.use("/comments/", commentsRoute);
router.use("*", (req, res) => res.json(statusMessage("No API found.", "error", 404)));

module.exports = router;