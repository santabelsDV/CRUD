const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


function writingFiles(req, res) {
    if (!req.file) {
        return res.status(400).json({error: "Файл не був завантажений"});
    }

    const tempPath = req.file.path;
    const ext = path.extname(req.file.originalname);
    const storageDir = path.join(__dirname, "../../storage");

    fs.readFile(tempPath, (err, data) => {
        if (err) {
            return res.status(500).json({error: "Помилка читання файлу"});
        }

        const hash = crypto.createHash("sha256").update(data).digest("hex");
        const newFileName = `${hash}${ext}`;
        const newPath = path.join(storageDir, newFileName);

        if (fs.existsSync(newPath)) {
            fs.unlinkSync(tempPath);
            return res.json({message: "Файл уже існує", file: newFileName});
        }

        fs.rename(tempPath, newPath, (err) => {
            if (err) {
                return res.status(500).json({error: "Помилка перейменування файлу"});
            }
            res.json({message: "Файл успішно завантажено", file: `http://localhost:3111/api/getFile/${newFileName}`});
        });
    });
}

module.exports = {writingFiles};
