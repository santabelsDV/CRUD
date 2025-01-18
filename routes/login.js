const express = require('express');
const router = express.Router();
const {login,refresh,registration,checkCode}=require("../controlers/loginControler");

router.post('/', login);
router.post('/refresh-token',refresh)
router.post('/registration',registration);
router.post('/check-code',checkCode);

module.exports = router;