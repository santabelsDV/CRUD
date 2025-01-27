const express = require('express');
const router = express.Router();
const routername = express.Router();
const { getBook, deleteBook, updateBook, addBook, getAllBook, getHello} = require('../app/controlers/booksController');

router.get('/:id', getBook);

router.delete('/:id', deleteBook);

router.put('/:id', updateBook);

router.post('/', addBook);

router.get('/', getAllBook );

routername.get('/',getHello)

module.exports = {router, routername};

