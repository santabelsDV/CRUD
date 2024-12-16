const express = require('express');
const router = express.Router();
const {login,refresh}=require("../controlers/loginControler");

router.get('/', login);
router.post('/refresh-token',refresh)

module.exports = router;