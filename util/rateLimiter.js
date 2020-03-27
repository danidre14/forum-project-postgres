const rateLimit = require("express-rate-limit");

const statusMessage = require("./statusMessage");
const statusCodes = require("./statusCodes");

module.exports = {
    createAccountLimiter: rateLimit({
        windowMs: 6 * 60 * 60 * 1000,
        max: 5,
        statusCode: 200,
        message:
            statusMessage({ notif: "Too many accounts created. Try again in about an hour." }, statusCodes.ERROR, 429)
    }),
    createPostLimiter: rateLimit({
        windowMs: 1.5 * 60 * 60 * 1000,
        max: 10,
        statusCode: 200,
        message:
            statusMessage({ notif: "Too many posts created. Try again in about an hour." }, statusCodes.ERROR, 429)
    }),
    createCommentLimiter: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 20,
        statusCode: 200,
        message:
            statusMessage({ notif: "Too many comments created. Try again in about an hour." }, statusCodes.ERROR, 429)
    })
}

//@TODO
/*
Add limits for:
- editing posts (10/hr)
- editing comments (20/hr)
*/