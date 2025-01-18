const passport = require('passport');
const { User } = require('../database/models');
const { writeRefreshToken, writeAccessToken } = require("../JWT/writeTokens");
const { generateRefreshToken, generateAccessToken } = require("../JWT/ganerationTokens");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passportConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3333/auth/google/callback',
};

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        passportConfig,
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Формування об'єкта користувача
                const finalUSer = {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName || ' ',
                    login: profile.emails[0].value,
                    password: profile.id,
                    email: profile.emails[0].value,
                    rolle: 'user',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                // Пошук існуючого користувача
                const existingUser = await User.findOne({ where: { login: profile.emails[0].value } });
                if (existingUser) {
                    return done(null, existingUser);
                }

                // Створення нового користувача
                const newUser = await User.create(finalUSer);

                // Генерація та збереження токенів
                const refreshToken = await generateRefreshToken(finalUSer);
                const accessToken = await generateAccessToken(finalUSer);

                await writeRefreshToken(newUser.id, refreshToken);
                await writeAccessToken(newUser.id, accessToken);

                // Повернення нового користувача
                return done(null, newUser);
            } catch (error) {
                console.error('Помилка в GoogleStrategy:', error);
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
