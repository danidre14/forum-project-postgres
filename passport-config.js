const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserByEmail, getUserById) {
    const authenticateUser = async (usernameOrEmail, password, done) => {
        let user = await getUserByUsername(usernameOrEmail);
        if (user === null || user === undefined || user === '') {
            user = await getUserByEmail(usernameOrEmail);
            if (user === null || user === undefined || user === '') {
                return done(null, false, { message: 'User does not exist' });
            }
        }
        //done(<errorType>, <user:object, false>, <message>)
        //https://www.youtube.com/watch?v=gzDB0ZGOjA0 > 12:59
        try {
            if (await bcrypt.compare(password, user.password)) {
                if (!user.is_verified)
                    return done(null, false, { message: 'Account not activated. Sign up again to re-send activation token.' });
                else
                    return done(null, user);
            } else {
                return done(null, false, { message: 'Username or Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };



    passport.use(new LocalStrategy({ usernameField: 'usernameOrEmail', passwordField: 'password' }, authenticateUser));
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
}

module.exports = initialize;