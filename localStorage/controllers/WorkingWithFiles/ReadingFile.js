const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "../../storage");

function readFile(req, res) {
    const { filename } = req.params;

    if (!filename) {
        return res.status(400).json({ error: "Не вказано ім'я файлу" });
    }

    const filePath = path.join(storageDir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Файл не знайдено" });
    }

    res.sendFile(filePath);
}

module.exports = { readFile };
