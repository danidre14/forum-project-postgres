const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");
const statusCodes = require("../util/statusCodes");
const rateLimiter = require("../util/rateLimiter");

const { Validator } = require("../util/utilities");
// const Validator = { ...require("validator"), ...require("../util/utilities") };

const Posts = require("../db/queries/posts");

router.get("/", async (req, res) => {
    const posts = await Posts.read();
    res.json(posts);
});

router.get("/create", (req, res) => {

    if (req.isAuthenticated()) {
        return res.json();
    }

    res.json({ hardReroute: "/" });
    // res.json(statusMessage({ code: "REROUTE", value: "/" }));
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const post = await Posts.read({ id });

    if (!post) return res.status(404).json(statusMessage("Post not found", statusCodes.ERROR, 404));
    res.json(post);
});

router.post("/", rateLimiter.createPostLimiter, tryGoNext, checkAuthenticatedToManipulatePost, async (req, res) => {
    const { username, title, body, author_id } = req.body;
    let post = validatePost({ username, title, body, author_id }, req.user.username, req.user.id);

    if (!post) return res.json(statusMessage("Invalid post", statusCodes.ERROR, 500));
    post = await Posts.create({ ...post, author_id });

    res.json(statusMessage({ message: "Success", post_id: post.id }));
});

router.put("/:id", tryGoNext, checkAuthenticatedToManipulatePost, tryGoNext, async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const { username, title, body } = req.body;
    let post = validatePost({ username, title, body });

    if (!post) return res.json(statusMessage("Invalid post", statusCodes.ERROR, 500));
    post = await Posts.update({ id }, post);

    res.json(statusMessage({ message: "Success", post }));
});

router.delete("/:id", tryGoNext, checkAuthenticatedToManipulatePost, tryGoNext, async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    await Posts.delete({ id });

    res.json(statusMessage("Post deleted"));
});


function checkAuthenticatedToManipulatePost(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ hardReroute: "/signin", message: statusMessage("Not authenticated", statusCodes.ERROR, 500) });
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.json({ hardReroute: "/" });
    // res.json(statusMessage({ code: "REROUTE", value: "/" }));
    // res.json({ message: "Error", value: "Is authenticated" });
}

const validatePost = ({ username, title, body, author_id }, sessionUsersName, sessionUsersId) => {
    const validTitle = Validator.isString(title) && Validator.isLength(title, { min: 1, max: 256 });
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 2048 });
    const post = {};
    if (validTitle && validBody) {
        post.title = title;
        post.body = body;
    } else return false;
    if (username !== sessionUsersName) return false;
    if (author_id !== sessionUsersId) return false;
    return post;
}

function tryGoNext(req, res, next) {
    return next();
    if (process.env.NODE_ENV !== "production") return next();
}

module.exports = router;