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

router.post("/:post_id", rateLimiter.createCommentLimiter, tryGoNext, checkAuthenticatedToManipulateComment, async (req, res) => {

    const post_id = req.params.post_id;
    if (!Validator.isNumber(post_id)) return res.json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const { username, body, author_id } = req.body;
    let comment = validateComment({ username, body, author_id }, req.user.username, req.user.id);

    if (!comment) return res.json(statusMessage("Invalid comment", statusCodes.ERROR, 500));
    comment = await Comments.create({ ...comment, author_id, post_id });

    res.json(statusMessage({ message: "Success", comment_id: comment.id }));
});

/*
router.put("/:id", tryGoNext, checkAuthenticatedToManipulateComment, async (req, res) => {

    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const { username, body, post_id } = req.body;
    let comment = validateComment({ username, body, post_id });

    if (!comment) return res.json(statusMessage("Invalid comment", statusCodes.ERROR, 500));
    comment = await Comments.update({ id }, comment);

    res.json(statusMessage({ message: "Success", comment_id: comment.id }));

});
*/

router.delete("/:id", tryGoNext, async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json({ hardReroute: "/posts/view", message: statusMessage("Invalid ID", statusCodes.ERROR, 500) });

    const comment = await Comments.read({ id });
    if (!comment) return res.json(statusMessage({ notif: "Comment not found." }));


    if (!req.isAuthenticated()) {
        return res.json(statusMessage({ notif: `Cannot delete comment. Not authenticated.` }));
    }

    if (!checkAuthorizedUser(comment, req.user)) {
        return res.json(statusMessage({ notif: `Cannot delete comment. Not authorized.` }));
    }

    await Comments.delete({ id });

    res.json(statusMessage({ message: "Success", notif: "Comment deleted." }));
});


function checkAuthenticatedToManipulateComment(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ hardReroute: "/signin", message: statusMessage("Not authenticated", statusCodes.ERROR, 500) });
}

function checkAuthorizedUser(comment, user) {
    return comment.author_id === user.id;
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
    return next();
    if (process.env.NODE_ENV !== "production") return next();
}

module.exports = router;