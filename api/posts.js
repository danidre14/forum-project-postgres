const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");
const statusCodes = require("../util/statusCodes");
const rateLimiter = require("../util/rateLimiter");

const { Validator } = require("../util/utilities");

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
});

router.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.status(500).json(statusMessage("Invalid ID", statusCodes.ERROR, 500));

    const post = await Posts.read({ id });

    if (!post) return res.status(404).json(statusMessage("Post not found", statusCodes.ERROR, 404));

    await Posts.update({ id }, { view_count: post.view_count + 1 });
    post.view_count++;

    res.json(post);
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

router.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.json({ hardReroute: "/posts/view", message: statusMessage("Invalid ID", statusCodes.ERROR, 500) });

    const post = await Posts.read({ id });
    if (!post) return res.json({ hardReroute: `/posts/view/`, message: statusMessage("Post not found", statusCodes.ERROR, 404) });


    if (!checkAuthenticatedToEditPost(req)) {
        return res.json({ hardReroute: `/posts/view/${id}`, message: statusMessage("Not Authenticated", statusCodes.ERROR, 500) });
    }

    if (!checkAuthorizedUser(post, req.user)) {
        return res.json({ hardReroute: `/posts/view/${id}`, message: statusMessage("Not Authorized", statusCodes.ERROR, 500) });
    }

    res.json(post);
});

router.put("/:id", tryGoNext, async (req, res) => {
    const id = req.params.id;
    if (!Validator.isNumber(id)) return res.json({ hardReroute: "/posts/view", message: statusMessage("Invalid ID", statusCodes.ERROR, 500) });

    const originalPost = await Posts.read({ id });
    if (!originalPost) return res.json({ hardReroute: `/posts/view/`, message: statusMessage("Post not found", statusCodes.ERROR, 404) });


    if (!checkAuthenticatedToEditPost(req)) {
        return res.json({ hardReroute: `/posts/view/${id}`, message: statusMessage("Not Authenticated", statusCodes.ERROR, 500) });
    }

    if (!checkAuthorizedUser(originalPost, req.user)) {
        return res.json({ hardReroute: `/posts/view/${id}`, message: statusMessage("Not Authorized", statusCodes.ERROR, 500) });
    }

    const { username, title, body, author_id } = req.body;

    let post = validatePost({ username, title, body, author_id }, req.user.username, req.user.id);
    if (!post) return res.json(statusMessage({ notif: "Invalid post" }, statusCodes.ERROR, 500));
    if (post.title === originalPost.title && post.body === originalPost.body) {
        return res.json(statusMessage({ notif: "No changes detected." }));
    }

    post = await Posts.update({ id }, { title, body });

    res.json(statusMessage({ message: "Success", notif: "Changes saved.", post_id: id }));
});

router.delete("/:id", tryGoNext, async (req, res) => {
    const id = req.params.id;

    if (!Validator.isNumber(id)) return res.json({ hardReroute: "/posts/view", message: statusMessage("Invalid ID", statusCodes.ERROR, 500) });

    const post = await Posts.read({ id });
    if (!post) return res.json(statusMessage({ notif: "Post not found." }));


    if (!checkAuthenticatedToEditPost(req)) {
        return res.json(statusMessage({ notif: "Cannot delete post. Not Authenticated." }));
    }

    if (!checkAuthorizedUser(post, req.user)) {
        return res.json(statusMessage({ notif: "Cannot delete post. Not Authorized." }));
    }

    await Posts.delete({ id });

    res.json(statusMessage({ message: "Success", notif: "Post deleted.", gotoUrl: "/posts/view/" }));
});


function checkAuthenticatedToManipulatePost(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ hardReroute: "/signin", message: statusMessage("Not authenticated", statusCodes.ERROR, 500) });
}

function checkAuthenticatedToEditPost(req) {
    return req.isAuthenticated();
}
function checkAuthorizedUser(post, user) {
    return post.author_id === user.id;
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