const express = require("express");
const router = express.Router();

const statusMessage = require("../util/statusMessage");
const statusCodes = require("../util/statusCodes");

const passport = require("passport");

const Users = require("../db/queries/users");

const initializePassport = require("../passport-config");
try {
    initializePassport(
        passport,
        async username => {
            try {
                return await Users.findOneByArray(['username', 'ilike', `%${username}%`], 'id is_verified password username');
            } catch {
                return null;
            }
        },
        async email => {
            try {
                return await Users.findOneByArray(['email', 'ilike', `%${email}%`], 'id is_verified password username');
            } catch {
                return null;
            }
        },
        async id => {
            try {
                return await Users.findOne({ id });
            } catch {
                return null;
            }
        }
    );
} catch (e) {
    console.log(e.message);
}

router.get("/*", checkNotAuthenticated, (req, res) => { res.json() });

router.post("/", checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.trace("Err1", err)
            return next(err);
        }
        if (!user) {
            console.log("Err2:", "User no exist");
            return res.json(statusMessage(info.message, statusCodes.ERROR, 500));
        }
        req.logIn(user, loginErr => {
            if (loginErr) {
                console.log("Err3", loginErr)
                return next(loginErr);
            }
            console.log("Signed in:", user);
            return res.json(statusMessage({ message: "Success", username: user.username, id: user.id }));
        });
    })(req, res, next);
});

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.json(statusMessage({ code: "REROUTE", value: "/" }));
    // res.json({ message: "Error", value: "Is authenticated" });
}

module.exports = router;