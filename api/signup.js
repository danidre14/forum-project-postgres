const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const statusMessage = require("../util/statusMessage");
const statusCodes = require("../util/statusCodes");
const rateLimiter = require("../util/rateLimiter");

const Users = require("../db/queries/users");
const Tokens = require("../db/queries/tokens");

const { Validator } = require("../util/utilities");

const tokenPurposes = require("../util/tokenPurposes");

const testEmail = false;


router.get('/', checkNotAuthenticated, (req, res) => { res.json() });

router.post('/', rateLimiter.createAccountLimiter, checkNotAuthenticated, validateInfomation, checkUserExists, createUser);

router.get('/verify', checkNotAuthenticated, (req, res) => { res.json() });


//Create Confimation Page Route
router.post('/verify', checkNotAuthenticated, async (req, res) => {
    try {
        if (req.body.token !== req.query.token) return res.json(
            statusMessage('An error occured. Please check your email and try again.', statusCodes.ERROR, 500)
        );
        const token = await Tokens.findOne({ token: req.body.token, purpose: tokenPurposes.TO_VERIFY_ACCOUNT });
        //Check if token exists
        if (!token) {
            return res.json(
                statusMessage('The activation link does not exist, or may have expired.', statusCodes.ERROR, 500)
            );
        }

        //Check if token matches account email  
        console.log("Check if token match account", token.user_id, req.body.username, req.body.email);
        const user = await Users.findOne([['id', `${token.user_id}`], ['username', 'ilike', `${req.body.username}`], ['email', 'ilike', `${req.body.email}`]]);
        if (!user) {
            return res.json(
                statusMessage('Username or email incorrect. Correct the information and try again, or sign up today.', statusCodes.ERROR, 500)
            );
        }

        //Check if user is verified
        await Tokens.delete({ id: token.id });
        if (user.is_verified) {
            return res.json(
                statusMessage({ message: "Success", notif: "Account already verified. You can sign in." })
            );
        }

        //Verify user
        await Users.update({ id: user.id }, { is_verified: 1 });

        return res.json(
            statusMessage({ message: "Success", notif: "Account verified. You may now sign in." })
        );

    } catch (err) {
        console.log("Message1:", err.message);
        return res.json(
            statusMessage('An error has occured. Please try again, or contact support.', statusCodes.ERROR, 500)
        );
    }
});

async function createUser(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let user = {
            username: (req.body.username).toLowerCase(),
            email: req.body.email,
            password: hashedPassword,
            is_verified: 0
        };

        if (process.env.NODE_ENV !== 'production' && !testEmail) {
            user.is_verified = 1; //verified by default if not in production
            await Users.create(user);
            console.log("Signed up", user);
            return res.json(
                statusMessage({ message: "Success", notif: `Development account ${user.email} created. Sign in with username ${user.username}.`, gotoUrl: "/signin" })
            );
        }

        user = await Users.create(user);
        // Create a verification token
        const token = await Tokens.create({ user_id: user.id, purpose: tokenPurposes.TO_VERIFY_ACCOUNT, token: crypto.randomBytes(16).toString('hex') });

        // Send the email
        const mailOptions = getMailOptions(user.username, user.email, req.headers.host, token.token);

        sendMail(mailOptions, user.email);

        return res.json(
            statusMessage({ message: "Success", notif: `A token has been sent to ${user.email}. Check your email to verify your account. Emails may take up to 10 minutes to reach your account.`, gotoUrl: "/signup" })
        );
    } catch (e) {
        console.log("Message2:", e.message);
        return res.json(
            statusMessage('An error has occured. Please report this issue or try again.', statusCodes.ERROR, 500)
        );
    }
}

async function checkUserExists(req, res, next) {
    try {
        //look for user by username
        let user = await Users.findOne(['username', 'ilike', `${req.body.username}`]);
        //if user by username does not exist
        if (!user) {
            //look for user by email
            user = await Users.findOne(['email', 'ilike', `${req.body.email}`]);

            //if user by email does not exist
            if (!user) {
                return next(); //proceed to create user
            }
        }

        //if user already exists
        /* 
            if user is verified -> redirect 'username unavailable'
            else if user not verified, but token exists for that user -> 
            if email exists: redirect 'check your email for verification token'
            else if user not verified, but token does not exist -> redirect 'an email has been sent to verify account'
            or if email does not exist
        */

        //if user verified
        if (user.is_verified) {
            if (user.username === req.body.username)
                return res.json(
                    statusMessage("Username unavailable.", statusCodes.ERROR, 500)
                );
            else if (user.email === req.body.email)
                return res.json(
                    statusMessage("An account with that email address already exists.", statusCodes.ERROR, 500)
                );
        }

        //if user not verified, look for token
        const token = await Tokens.findOne({ user_id: user.id, purpose: tokenPurposes.TO_VERIFY_ACCOUNT });

        //if token does not exist
        if (!token) {
            // Create a verification token
            const newToken = await Tokens.create({ user_id: user.id, purpose: tokenPurposes.TO_VERIFY_ACCOUNT, token: crypto.randomBytes(16).toString('hex') });

            // Send the email for resend token
            const mailOptions = getMailOptions(user.username, user.email, req.headers.host, newToken.token);

            sendMail(mailOptions, user.email);

            return res.json(
                statusMessage({ message: "Success", notif: `A token has been resent to ${user.email}. Check your email to verify your account. Emails may take up to 10 minutes to reach your account.`, gotoUrl: "/signup" })
            );
        }


        //if token exists

        //look for username and email
        if (user.username === req.body.username && user.email === req.body.email) {//email exists
            //check email for verification token
            return res.json(
                statusMessage('Account already registered. Check your email for the verification token.')
            );
        } else {//email does not exist
            //save new email || username
            await Users.update({ id: user.id }, { username: req.body.username, email: req.body.email });

            // Create a verification token
            const newToken = await Tokens.create({ user_id: user.id, purpose: tokenPurposes.TO_VERIFY_ACCOUNT, token: crypto.randomBytes(16).toString('hex') });

            // Send the email for resend token
            const mailOptions = getMailOptions(user.username, user.email, req.headers.host, newToken.token);

            sendMail(mailOptions, user.email);

            return res.json(
                statusMessage({ message: "Success", notif: `A token has been resent to ${user.email}. Check your email to verify your account. Emails may take up to 10 minutes to reach your account.`, gotoUrl: "/signup" })
            );
        }
    } catch (e) {
        console.log("Message3:", e.message);
        return res.json(
            statusMessage("Error Occurred.", statusCodes.ERROR, 500)
        );
    }
}

function validateInfomation(req, res, next) {
    let error = false;

    //username validation
    const username = req.body.username;
    let uMessage = "";
    if (username.length < 4 || username.length > 15) {
        uMessage += "-Username must be 4-15 characters long";
        error = true;
    } else {
        if (username.charAt(0).match(/^[a-z]+$/ig) === null) {
            uMessage += "-Username must start with a letter\n";
            error = true;
        } else if (username.match(/^[a-z][a-z\d]+$/ig) === null) {
            uMessage += "-Symbols/Spaces not allowed in username";
            error = true;
        }
    }

    //password validation
    const pName = req.body.password;
    let pMessage = "";
    if (pName.length < 8) {
        pMessage += "-Password must be 8 or more characters\n";
        error = true;
    }
    // if(pName.match(/^[a-z\d]+$/ig) === null) {
    //     pMessage += "-Password cannot contain symbols or spaces\n";
    //     error = true;
    // }
    if (pName.search(/\d/) === -1) {
        pMessage += "-Password must contain at least one number\n";
        error = true;
    }
    if (pName.search(/[A-Z]/) === -1) {
        pMessage += "-Password must contain at least one uppercase letter";
        error = true;
    }
    //re-entered password
    const p2Name = req.body.password2;
    let p2Message = "";
    if (pName !== p2Name) {
        p2Message += "-Passwords do not match";
        error = true;
    }

    //email validation
    const email = req.body.email;
    let eMessage = "";
    if (Validator.isString(email) && email.trim() === "") {
        eMessage += "-Missing email address";
        error = true;
    } else if (!Validator.isEmail(email)) {
        eMessage += "-Unexpected email address";
        error = true;
    }

    //re-entered email
    const email2 = req.body.email2;
    let e2Message = "";
    if (email !== email2) {
        e2Message += "-Emails do not match";
        error = true;
    }

    //redirect if needed
    if (error) {
        return res.json(
            statusMessage({
                uMessage,
                pMessage,
                p2Message,
                eMessage,
                e2Message
            }, statusCodes.ERROR, 500)

        );
    }

    next();
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.json({ hardReroute: "/" });
}

function getMailOptions(username = 'User', email, host, token) {
    const protocol = `https`;
    const siteLink = process.env.NODE_ENV !== 'production' ?
        "localhost:8080" : `${protocol}:\/\/${host}`;
    const tokenLink = `${siteLink}\/signup\/verify?token=${token}`;
    const options = {
        from: 'Dani-Smorum <no-reply@dani-smorum.com>',
        to: `${username} <${email}>`,
        subject: 'Dani-Smorum: Account Verification Token',
        text: `Hello ${username},\n\n
        Please verify your account by clicking the following link: \n${tokenLink}.\n`,
        html: `
        <body style="margin:0;padding:0;">
	        <div style="padding:0;margin:0;text-align:center;font-size:1.4rem;padding:0;font-family:Helvetica;">
                <h2>Hello ${username},</h2>
                <div style="text-align:left;">
                    <p>Welcome to Dani-Smorum. Before you sign in, however, you are required to verify your account.</p>
                    <p>Please verify your account by clicking the button below:</p>
                    <a style='background-color:#17a2b8;color:#E3DBD8;text-decoration:none;padding:.7rem 1rem;font-size: 1rem;display:inline-block;border-radius: .5rem;margin-left:1.4rem;' href="${tokenLink}">Verify Account</a>
                </div>
                <div style="text-align:left;">
                    <p>If the button does not work, copy/paste the link below into a new tab:</p>
                    <a href="${tokenLink}">${tokenLink}</a>
                </div>
                <hr />
                <p>Don't recognize this activity? You can ignore this e-mail. No further action is needed.</p>
            </div>
        </body>`
    };
    return options;
}

function sendMail(mailOptions, email) {
    if (process.env.NODE_ENV !== 'production' && !testEmail) {
        //development environment
        return console.log('Mail sent, make sure to actually send here');
    }

    //otherwise, send mail
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(mailOptions, function (err) {
        if (err) {
            return console.log("Message4:", err.message);
        }
        console.log('A verification email has been sent to ' + email + '.');
    });
}

module.exports = router;