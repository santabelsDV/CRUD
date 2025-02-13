const express = require('express');
const routerUser = express.Router();

const getUserInterface = require('../app/controlers/userInterface');
const {upload} = require('../localStorage/servise/WritingFile');
routerUser.get('/',  getUserInterface.getInfo);
routerUser.put('/', getUserInterface.updateInfoLittle);
routerUser.put('/foto',upload.single("image"), getUserInterface.updateFoto);

module.exports = {routerUser};