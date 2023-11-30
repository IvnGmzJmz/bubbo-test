// DTOs/BookDTO.js
class BookDTO {
    constructor(id, title, author,image, sinopsis) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.image = image;
      this.sinopsis = sinopsis;
    }
  }
  
  module.exports = BookDTO;
  