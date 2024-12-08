const express = require('express');
const router = express.Router();
const { getBook, deleteBook, updateBook, addBook, getAllBook } = require('./booksController');

router.get('/:id', getBook);

router.delete('/:id', deleteBook);

router.put('/:id', updateBook);

router.post('/', addBook);

router.get('/', getAllBook )



module.exports = router;

