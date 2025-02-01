const {books} = require('../../database/models');
const {validateData} = require('../service/validation/validationScheme');

async function getAllBook(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const allPages = await books.count();

    const booksWithCondition = await books.findAll({
        order: [['id', 'ASC']],
        limit: limit,
        offset: offset,
    });

    const results = booksWithCondition.map(book => book.dataValues);

    const currentPage = Math.ceil(allPages / limit);

    res.json({
        results,
        allPages: currentPage,

    });
}

async function addBook(req, res) {

    let Pages = parseInt(req.body.Pages, 10);
    let Name = String(req.body.Name);
    let Author = String(req.body.Author);
    let Year = String(req.body.Year);

    const validationResult = validateData(req.body, ["Pages", "Name", "Author", "Year"]);

    if (validationResult !== 'Validation passed') {
        return res.status(400).send(validationResult);
    }

    try {
        await books.create({
            Pages: Pages,
            Name: Name,
            Author: Author,
            Year: Year
        });

        res.status(200).send('The book has been successfully created');
    } catch (error) {
        console.error('Error creating a book:', error);
        res.status(500).send('Error creating a book');
    }

}

async function deleteBook(req, res) {
    let id = parseInt(req.params.id, 10);
    console.log('delete' + id);

    try {
        await books.destroy({
            where: {
                id: id
            }
        });

        res.status(200).send('Book successfully deleted');

    } catch (error) {
        console.error('Error deleting a book:', error);
        res.status(500).send('Error deleting a book');
    }
}

async function updateBook(req, res) {
    const {Pages, Name, Author, Year} = req.body;
    let id = parseInt(req.params.id, 10);

    const validationResult = validateData(req.body, ["Pages", "Name", "Author", "Year"]);

    if (validationResult !== 'Validation passed') {
        return res.status(400).send(validationResult); // Відправляємо повідомлення про помилку
    }

    try {
        await books.update({
            Pages: Pages,
            Name: Name,
            Author: Author,
            Year: Year
        }, {
            where: {
                id: id
            }
        })
        res.status(200).send('Book successfully modified');
    } catch (error) {
        console.error('Error changing the book:', error);
        res.status(500).send('Book change error');
    }
}

async function getBook(req, res) {
    let id = parseInt(req.params.id, 10);

    try {
        await books.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            res.status(200).send(result);
        });

    } catch (error) {
        console.error('Error when receiving books:', error);
        res.status(500).send('Server error');
    }
}

async function getHello(req, res) {
    res.send('Everything works!');
}

module.exports = {getBook, deleteBook, updateBook, getAllBook, addBook, getHello};