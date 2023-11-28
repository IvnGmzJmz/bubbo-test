// controllers/booksController.js

const booksService = require('../services/booksService');

const handleError = (res, error) => {
  res.status(500).json({ error: error });
};

const getBooks = async (req, res) => {
  try {
    const books = await booksService.getBooks();
    res.json(books);
  } catch (error) {
    handleError(res, error.message);
  }
};

const getBook = async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await booksService.getBook(bookId);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    handleError(res, error.message);
  }
};

const createBook = async (req, res) => {
  const bookData = req.body;
  try {
    const newBook = await booksService.createBook(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    handleError(res, error.message);
  }
};

const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedBook = await booksService.updateBook(bookId, updatedData);
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    handleError(res, error.message);
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;
  try {
    const deletedBook = await booksService.deleteBook(bookId);
    if (deletedBook) {
      res.json(deletedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    handleError(res, error.message);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
