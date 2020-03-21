const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");
const statusCodes = require("../util/statusCodes");
const rateLimiter = require("../util/rateLimiter");

const { Validator } = require("../util/utilities");
// const Validator = { ...require("validator"), ...require("../util/utilities") };

const Comments = require("../db/queries/comments");

// router.get("/", async (req, res) => {
//     const comments = await Comments.read();
//     res.json(comments);
// });

router.get("/:post_id", async (req, res) => {
    const post_id = req.params.post_id;
    if (!Validator.isNumber(post_id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const comments = await Comments.getFromPost({ post_id });

    res.json(comments);
});

router.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const comment = await Comments.read({ id });

    if (!comment) return res.status(404).json(statusMessage("Comment not found", statusCodes.ERROR, 404));
    res.json(comment);
});

router.post("/:post_id", rateLimiter.createCommentLimiter, tryGoNext, checkAuthenticated, async (req, res) => {

    const post_id = req.params.post_id;
    if (!Validator.isNumber(post_id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const { username, body, author_id } = req.body;
    const comment = validateComment({ username, body, author_id }, req.user.username, req.user.id);

    if (!comment) return res.status(500).json(statusMessage("Invalid comment", statusCodes.ERROR, 500));
    const newComment = await Comments.create({ ...comment, author_id, post_id });

    res.json(newComment);
});

router.put("/:id", tryGoNext, checkAuthenticated, async (req, res) => {

    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const { username, body, post_id } = req.body;
    const comment = validateComment({ username, body, post_id });

    if (!comment) return res.status(500).json(statusMessage("Invalid comment", statusCodes.ERROR, 500));
    const newComment = await Comments.update({ id }, comment);

    res.json(newComment);
});

router.delete("/:id", tryGoNext, checkAuthenticated, async (req, res) => {

    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    await Comments.delete({ id });

    res.json(statusMessage("Comment deleted"));
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json(statusMessage("Not authenticated", statusCodes.ERROR, 500));
}

const validateComment = ({ username, body, author_id }, sessionUsersName, sessionUsersId) => {
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 1024 });
    const comment = {}
    if (validBody) {
        comment.body = body;
    } else return false;
    if (username !== sessionUsersName) return false;
    if (author_id !== sessionUsersId) return false;
    return comment;
}


function tryGoNext(req, res, next) {
    if (process.env.NODE_ENV !== "production") return next();
}

module.exports = router;