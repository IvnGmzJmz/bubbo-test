// services/booksService.js

const db = require("../../firebase");
const BookDto = require("../dtos/bookDTO");

const booksCollection = db.collection('books');

const FIELD_NAMES = {
  ID: 'id',
  TITLE: 'title',
  AUTHOR: 'author',
  IMAGE: 'image',
  SINOPSIS: 'sinopsis',
};

const handleError = (message) => {
  console.error(message);
  throw { message, statusCode: 500 };
};

const validateRequiredFields = (data) => {
  const requiredFields = [FIELD_NAMES.TITLE, FIELD_NAMES.AUTHOR];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw { message: `${field} is a required field`, statusCode: 400 };
    }
  }
};

const mapBookData = (doc) => {
  return new BookDto(
    doc.id,
    doc.data().title,
    doc.data().author,
    doc.data().image,
    doc.data().sinopsis
  );
};


const getBooks = async () => {
  try {
    const snapshot = await booksCollection.get();
    return snapshot.docs.map(mapBookData);
  } catch (error) {
    handleError(error.message);
  }
};

const getBook = async (bookId) => {
  try {
    const doc = await booksCollection.doc(bookId).get();
    return doc.exists ? mapBookData(doc) : null;
  } catch (error) {
    handleError(error.message);
  }
};

const createBook = async (bookData) => {
  try {
    validateRequiredFields(bookData);
    const doc = await booksCollection.add(bookData);
    const newDoc = await doc.get();
    return new BookDto(newDoc.id);
  } catch (error) {
    handleError(error.message);
  }
};

const updateBook = async (bookId, updatedData) => {
  try {
    validateRequiredFields(updatedData);
    const docRef = booksCollection.doc(bookId);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.update(updatedData);
      const updatedDoc = await docRef.get();
      return mapBookData(updatedDoc);
    } else {
      return null;
    }
  } catch (error) {
    handleError(error.message);
  }
};

const deleteBook = async (bookId) => {
  try {
    const docRef = booksCollection.doc(bookId);
    const doc = await docRef.get();

    if (doc.exists) {
      const deletedDoc = mapBookData(doc);
      await docRef.delete();
      return deletedDoc;
    } else {
      return null;
    }
  } catch (error) {
    handleError(error.message);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
