# Інструкція для інсталяції проекту

Щоб встановити проект на інший пристрій, виконайте наступні кроки в командній строці:

1. **Клонування репозиторію:**
   ```bash
   git clone https://github.com/santabelsDV/CRUD.git
   cd CRUD
   ```

2. **Встановлення залежностей:**
   Переконайтеся, що у вас встановлено Node.js та npm. Потім виконайте:
   ```bash
   npm install
   ```

3. **Налаштування середовища:**
   Створіть файл `.env` у кореневій директорії проекту та налаштуйте необхідні змінні середовища. Приклад:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   ```

4. **Запуск проекту:**
   Для запуску проекту виконайте:
   ```bash
   npm start
   ```

5. **Перевірка:**
   Після завершення всіх дій наведених вище кроків можна перевірии чи сервер працює запитом в бравзері `http://localhost:{port}`. Результатом запиту повине бути повідомлення про успішність запиту.