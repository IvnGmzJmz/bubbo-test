// services/booksService.js

const admin = require('firebase-admin');

const serviceAccount = require('../path/to/your/firebase-credentials.json');
const BookDto = require('../dtos/bookDTO');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // otras configuraciones...
});

const db = admin.firestore();
const booksCollection = db.collection('books');

const handleError = (error) => {
  console.error(error);
  throw new Error('Internal Server Error');
};

const getBooks = async () => {
    try {
      const snapshot = await booksCollection.get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => new BookDto(doc.id, doc.data().title, doc.data().author));
      } else {
        return [];
      }
    } catch (error) {
      handleError(error);
    }
  };
  

const getBook = async (bookId) => {
  try {
    const doc = await booksCollection.doc(bookId).get();
    return doc.exists ? new BookDto(doc.id,doc.title,doc.author) : null;
  } catch (error) {
    handleError(error);
  }
};

const createBook = async (bookData) => {
  try {
    if (!bookData.title || !bookData.author) {
        throw { message: 'Title and author are required fields', statusCode: 400 };
    }

    const doc = await booksCollection.add(bookData);
    const newDoc = await doc.get();
    return new BookDto(newDoc.id,newDoc.title,newDoc.author);
  } catch (error) {
    handleError(error);
  }
};

const updateBook = async (bookId, updatedData) => {
  try {

    if (!updatedData.title || !updatedData.author) {
        throw { message: 'Title and author are required fields', statusCode: 400 };
    }

    const docRef = booksCollection.doc(bookId);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.update(updatedData);
      const updatedDoc = await docRef.get();
      return new BookDto(updatedDoc.id,updatedDoc.title,updatedDoc.author);
    } else {
      return null;
    }
  } catch (error) {
    handleError(error);
  }
};

const deleteBook = async (bookId) => {
  try {
    const docRef = booksCollection.doc(bookId);
    const doc = await docRef.get();

    if (doc.exists) {
      const deletedDoc = new BookDto(doc.id,doc.title,doc.author);
      await docRef.delete();
      return deletedDoc;
    } else {
      return null;
    }
  } catch (error) {
    handleError(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};