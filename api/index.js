const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");

const Validator = { ...require("validator"), ...require("../util/utilities") };

const { Posts, Comments } = require("../db/queries");

router.get("/", async (req, res) => {
    const posts = await Posts.read();
    res.json(posts);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", "error", 406));

    const post = await Posts.read(id);
    const comments = await Comments.getFromPost(id);

    res.json(post ? { ...post, comments } : statusMessage("Post not found", "error", 404));
});

router.post("/", async (req, res) => {
    const { username, title, body } = req.body;
    const post = validatePost({ username, title, body });

    if (!post) return res.json(statusMessage("Invalid post", "error", 406));
    const [newPost] = await Posts.create(post);

    res.json(newPost);
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", "error", 406));

    const { username, title, body } = req.body;
    const post = validatePost({ username, title, body });

    if (!post) return res.json(statusMessage("Invalid post", "error", 406));
    const [newPost] = await Posts.update(id, post);

    res.json(newPost);
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json(statusMessage("Invalid ID", "error", 406));

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