const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");

const postsRoute = require("./posts");
const commentsRoute = require("./comments");
const signupRoute = require("./signup");
const signinRoute = require("./signin");
const signoutRoute = require("./signout");
const usersRoute = require("./users");

// CORS
if (process.env.NODE_ENV !== "production") {
    router.use((req, res, next) => {
        if (req.path !== '/' && !req.path.includes('.')) {
            res.header({
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': req.headers.origin || '*',
                'Access-Control-Allow-Headers': 'X-Requested-With',
                'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE',
                'Content-Type': 'application/json; charset=utf-8'
            })
        }
        next();
    });
}

router.use("/comments/", commentsRoute);
router.use("/signup/", signupRoute);
router.use("/signin/", signinRoute);
router.use("/signout/", signoutRoute);
router.use("/users/", usersRoute);
router.use("/posts/", postsRoute);
router.use("*", (req, res) => res.status(404).json(statusMessage("No API found.", "error", 404)));

module.exports = router;