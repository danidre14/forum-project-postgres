const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");

const Validator = { ...require("validator"), ...require("../util/utilities") };

const { Posts } = require("../db/queries");

router.get("/", async (req, res) => {
    const posts = await Posts.read();
    res.json(posts);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", "error", 500));

    const post = await Posts.read(id);

    if (!post) return res.status(404).json(statusMessage("Post not found", "error", 404));
    res.json(post);
});

router.post("/", async (req, res) => {
    const { username, title, body } = req.body;
    const post = validatePost({ username, title, body });

    if (!post) return res.status(500).json(statusMessage("Invalid post", "error", 500));
    const [newPost] = await Posts.create(post);

    res.json(newPost);
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", "error", 500));

    const { username, title, body } = req.body;
    const post = validatePost({ username, title, body });

    if (!post) return res.status(500).json(statusMessage("Invalid post", "error", 500));
    const [newPost] = await Posts.update(id, post);

    res.json(newPost);
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", "error", 500));

    await Posts.delete(id);

    res.json(statusMessage("Post deleted"));
});

const validatePost = ({ username, title, body }) => {
    const validTitle = Validator.isString(title) && Validator.isLength(title, { min: 1, max: 256 });
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 2048 });
    const post = {}
    if (validTitle && validBody) {
        post.title = title;
        post.body = body;
    } else return false;
    if (username && Validator.isLength(username, { min: 1, max: 64 })) post.username = username;
    return post;
}

module.exports = router;