const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");

const Validator = { ...require("validator"), ...require("../util/utilities") };

const { Comments } = require("../db/queries");

// router.get("/", async (req, res) => {
//     const comments = await Comments.read();
//     res.json(comments);
// });

router.get("/:post_id", async (req, res) => {
    const post_id = req.params.post_id;
    if (!Validator.isNumber(post_id)) return res.json(statusMessage("Invalid ID", "error", 406));

    const comments = await Comments.getFromPost(post_id);

    res.json(comments);
});

router.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", "error", 406));

    const comment = await Comments.read(id);

    res.json(comment ? comment : statusMessage("Comment not found", "error", 404));
});

router.post("/:post_id", async (req, res) => {
    const post_id = req.params.post_id;
    if (!Validator.isNumber(post_id)) return res.json(statusMessage("Invalid ID", "error", 406));

    const { username, body, post_id } = req.body;
    const comment = validateComment({ username, body, post_id });

    if (!comment) return res.json(statusMessage("Invalid comment", "error", 406));
    const [newComment] = await Comments.create(comment);

    res.json(newComment);
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", "error", 406));

    const { username, body, post_id } = req.body;
    const comment = validateComment({ username, body, post_id });

    if (!comment) return res.json(statusMessage("Invalid comment", "error", 406));
    const [newComment] = await Comments.update(id, comment);

    res.json(newComment);
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", "error", 406));

    await Comments.delete(id);

    res.json(statusMessage("Comment deleted"));
});

const validateComment = ({ username, body, post_id }) => {
    if (!Validator.isNumber(post_id)) return false;
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 1024 });
    const comment = {}
    if (validBody) {
        comment.body = body;
        comment.post_id = post_id;
    } else return false;
    if (username && Validator.isLength(username, { min: 1, max: 64 })) comment.username = username;
    return comment;
}

module.exports = router;