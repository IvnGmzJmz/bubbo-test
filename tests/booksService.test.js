// booksService.test.js
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { expect, assert } = chai;
const sinon = require('sinon');
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../src/services/booksService');
const BookDto = require('../src/dtos/bookDTO');

// Supongamos que `booksCollection` es el nombre del objeto que contiene la colección de libros
const booksCollection = {
  get: sinon.stub(),
  doc: sinon.stub(),
  add: sinon.stub(),
  update: sinon.stub(),
  delete: sinon.stub(),
};

const testBookData = {
  title: 'La sombra del viento',
  author: 'Carlos Ruiz Zafón',
  image: 'https://images.cdn2.buscalibre.com/fit-in/360x360/30/57/3057e792c1953b16740975d6fa56664f.jpg',
  sinopsis: 'Lorem ipsum. ',
};

describe('Books Service', () => {
  describe('getBooks', () => {
    it('Return array of books', async () => {
      booksCollection.get.resolves({
        docs: [{ id: '1', data: () => testBookData }],
        empty: false,
      });

      const books = await getBooks(booksCollection);
      expect(books).to.be.an('array');
      expect(books[0]).to.be.an.instanceOf(BookDto);
    });
  });

  describe('getBook', () => {
    it('Find a certain book', async () => {
      booksCollection.get.resolves({
        docs: [{ id: '1', data: () => testBookData }],
        empty: false,
      });
      const books = await getBooks(booksCollection);

      const book = await getBook(books[0].id, booksCollection);
      expect(book).to.be.an.instanceOf(BookDto);

      const notFoundBook = await getBook('0', booksCollection);
      expect(notFoundBook).to.be.null;
    });
  });

  describe('createBook', () => {
    it('Create a new book', async () => {
      const addStub = sinon.stub().resolves({ get: sinon.stub().resolves({ id: '1', data: () => testBookData }) });
      booksCollection.add = addStub;

      const newBook = await createBook(testBookData, booksCollection);
      expect(newBook).to.be.an.instanceOf(BookDto);
    });

    it('Throw error if title is missing', async () => {
      const addStub = sinon.stub().resolves({ get: sinon.stub().resolves({ id: '1', data: () => testBookData }) });
      booksCollection.add = addStub;

      const createBookWithoutTitle = createBook({ author: 'Carlos Ruiz Zafón' }, booksCollection);
      await expect(createBookWithoutTitle).to.be.rejectedWith('title is a required field');
    });

    it('Throw error if author is missing', async () => {
        const addStub = sinon.stub().resolves({ get: sinon.stub().resolves({ id: '1', data: () => testBookData }) });
        booksCollection.add = addStub;
  
        const createBookWithoutTitle = createBook({ title: 'La sombra del viento' }, booksCollection);
        await expect(createBookWithoutTitle).to.be.rejectedWith('author is a required field');
      });
  });

  describe('updateBook', () => {
    it('Update an existing book', async () => {
      booksCollection.get.resolves({
        docs: [{ id: '1', data: () => testBookData }],
        empty: false,
      });
      const updateStub = sinon.stub().resolves({ get: sinon.stub().resolves({ id: '1', data: () => testBookData }) });
      booksCollection.doc.update = updateStub;

      const books = await getBooks(booksCollection);


      const updatedBook = await updateBook(books[0].id, testBookData, booksCollection);
      expect(updatedBook).to.be.an.instanceOf(BookDto);
    });

    it('Throw error if the author is missing', async () => {
      const docStub = { get: sinon.stub().resolves({ exists: true, id: '1', data: () => testBookData }) };
      booksCollection.doc.withArgs('1').returns(docStub);
      const updateStub = sinon.stub().resolves({ get: sinon.stub().resolves({ id: '1', data: () => testBookData }) });
      booksCollection.doc.update = updateStub;

      const updateBookWithoutTitle = updateBook('1', { title: 'La sombra del viento'}, booksCollection);
      await expect(updateBookWithoutTitle).to.be.rejectedWith('author is a required field');
    });

    it('Throw error if the title is missing', async () => {
        const docStub = { get: sinon.stub().resolves({ exists: true, id: '1', data: () => testBookData }) };
        booksCollection.doc.withArgs('1').returns(docStub);
        const updateStub = sinon.stub().resolves({ get: sinon.stub().resolves({ id: '1', data: () => testBookData }) });
        booksCollection.doc.update = updateStub;
  
        const updateBookWithoutTitle = updateBook('1', { author: 'Carlos Ruiz Zafón'}, booksCollection);
        await expect(updateBookWithoutTitle).to.be.rejectedWith('title is a required field');
      });

    it('Throw error if the book not exist', async () => {
      const docStub = { get: sinon.stub().resolves({ exists: false }) };
      booksCollection.doc.withArgs('0').returns(docStub);

      const nonExistentBook = await updateBook('0', testBookData, booksCollection);
      expect(nonExistentBook).to.be.null;
    });
  });

  describe('deleteBook', () => {
    it('Delete an existing book', async () => {
      booksCollection.get.resolves({
        docs: [{ id: '1', data: () => testBookData }],
        empty: false,
      });
      const books = await getBooks(booksCollection);

      const deletedBook = await deleteBook(books[0].id, booksCollection);
      expect(deletedBook).to.be.an.instanceOf(BookDto);
    });

    it('Null if the book not exist', async () => {
      const docStub = { get: sinon.stub().resolves({ exists: false }) };
      booksCollection.doc.withArgs('0').returns(docStub);

      const nonExistentBook = await deleteBook('0', booksCollection);
      expect(nonExistentBook).to.be.null;
    });
  });
});
