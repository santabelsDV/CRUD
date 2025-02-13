const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const PutUpload = multer({ dest: path.join(__dirname, "../../storage/TmpUploads") });

async function PutFile(req, res) {
    try {
        const { filename } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: "Файл не був завантажений" });
        }

        const tempPath = req.file.path; // Тимчасовий шлях до завантаженого файлу
        const storageDir = path.join(__dirname, "../../storage");
        const filePath = path.join(storageDir, filename);

        try {
            // Перевіряємо, чи існує файл для оновлення
            await fs.access(filePath);

            // Переміщуємо файл без змін
            await fs.rename(tempPath, filePath);

            return res.json({ message: "Файл успішно оновлено", file: filename });
        } catch {
            return res.status(404).json({ error: "Файл не знайдено" });
        }
    } catch (error) {
        console.error("Помилка редагування файлу:", error);
        res.status(500).json({ error: "Помилка редагування файлу" });
    }
}

module.exports = { PutFile, PutUpload };
