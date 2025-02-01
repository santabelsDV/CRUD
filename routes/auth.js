const express = require('express');
const router = express.Router();
const passport = require('passport');
const OauthController = require("../app/controlers/oaythControler");

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        session: false
    }),
    OauthController.callback
);

router.post('/token', express.json(),
    (req, res) => {
        OauthController.checkCode(req, res);
    });

module.exports = router;
