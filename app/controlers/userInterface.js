const jwt = require('jsonwebtoken');
const {User} = require('../models');
const {validateData} = require("../service/validation/validationScheme");
const request = require('request-promise')
const {createReadStream} = require("node:fs");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class UserInterface {

    async getInfo(req, res) {

        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user;

        try {
            user = await User.findOne({
                where: {
                    id: decoded.id
                }
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server error'});
        }
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            login: user.login,
            email: user.email,
            role: user.rolle,
            fotoLink: ""+user.fotoLink
        });

    }

    async updateInfoLittle(req, res) {

        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const keyInReq = Object.keys(req.body);

        const validationResult = validateData(req.body, keyInReq);

        if (validationResult !== 'Validation passed') {
            return res.status(400).send(validationResult);
        }
        const {firstName, lastName, login, fotoLink} = req.body
        let user;
        try {
            user = await User.update({
                firstName: firstName,
                lastName: lastName,
                login: login,
                fotoLink: fotoLink
            }, {
                where: {
                    id: decoded.id
                }
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server error'});
        }

        res.status(200).json({message: 'User successfully updated'});

    }


    async updateFoto(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: "The file was not uploaded" });
        }
        const tempPath = req.file.path;

        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const keyInReq = Object.keys(req.body);
        const validationResult = validateData(req.body, keyInReq);

        if (validationResult !== 'Validation passed') {
            return res.status(400).send(validationResult);
        }

        try {
            // Створюємо форму та додаємо файл з ключем "image"
            const form = new FormData();
            form.append('image', fs.createReadStream(tempPath), {
                filename: req.file.originalname // Додаємо оригінальну назву файлу
            });

            // Відправляємо запит з заголовками Authorization та form-data
            const response = await axios.post(
                'http://localhost:3111/api/upload',
                form,
                {
                    headers: {
                        ...form.getHeaders(), // Автоматично додає boundary
                        'Authorization': `Bearer ${token}`, // Додаємо токен
                    }
                }
            );

            // Оновлюємо користувача в базі

            await User.update({
                fotoLink: response.data.file,
            }, {
                where: {
                    id: decoded.id
                }
            });

            return res.status(200).json({ message: 'User successfully updated' });

        } catch (e) {
            console.error("Error:", e);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}



module.exports = new UserInterface();