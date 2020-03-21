const rateLimit = require("express-rate-limit");

module.exports = {
    createAccountLimiter: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 5,
        message: "Too many accounts created. Try again in an hour."
    }),
    createPostLimiter: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 50,
        message: "Too many posts created. Try again in an hour."
    }),
    createCommentLimiter: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 15,
        message: "Too many comments created. Try again in an hour."
    })
}

//@TODO
/*
Add limits for:
- editing posts (10/hr)
- editing comments (20/hr)
*/