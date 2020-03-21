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

    res.json(statusMessage({ code: "REROUTE", value: "/" }));
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const post = await Posts.read({ id });

    if (!post) return res.status(404).json(statusMessage("Post not found", statusCodes.ERROR, 404));
    res.json(post);
});

router.post("/", rateLimiter.createPostLimiter, tryGoNext, checkAuthenticated, async (req, res) => {
    const { username, title, body, author_id } = req.body;
    const post = validatePost({ username, title, body, author_id }, req.user.username, req.user.id);

    if (!post) return res.status(500).json(statusMessage("Invalid post", statusCodes.ERROR, 500));
    const newPost = await Posts.create({ ...post, author_id });

    res.json(newPost);
});

router.put("/:id", checkAuthenticated, tryGoNext, async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const { username, title, body } = req.body;
    const post = validatePost({ username, title, body });

    if (!post) return res.status(500).json(statusMessage("Invalid post", statusCodes.ERROR, 500));
    const newPost = await Posts.update({ id }, post);

    res.json(newPost);
});

router.delete("/:id", checkAuthenticated, tryGoNext, async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    await Posts.delete({ id });

    res.json(statusMessage("Post deleted"));
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json(statusMessage("Not authenticated", statusCodes.ERROR, 500));
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.json(statusMessage({ code: "REROUTE", value: "/" }));
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
    if (process.env.NODE_ENV !== "production") return next();
}

module.exports = router;