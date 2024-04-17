import { nanoid } from 'nanoid';
import books from './books.js';

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);

    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Gagal menambahkan buku',
    })
    .code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  const destructureBooks = (booksBefore) => {
    const filteredBooks = booksBefore.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return filteredBooks;
  };

  const { name, reading, finished } = request.query;

  if (name) {
    const nameLowercased = name.toLowerCase();

    const filteredBooksByName = books.filter(
      (book) => book.name.toLowerCase().includes(nameLowercased) === true,
    );

    const response = h.response({
      status: 'success',
      data: {
        books: destructureBooks(filteredBooksByName),
      },
    });

    return response;
  }

  if (reading) {
    let filteredBooksByReading = books;

    if (reading === '0') {
      filteredBooksByReading = books.filter((book) => book.reading === false);
    } else if (reading === '1') {
      filteredBooksByReading = books.filter((book) => book.reading === true);
    }

    const response = h.response({
      status: 'success',
      data: {
        books: destructureBooks(filteredBooksByReading),
      },
    });

    return response;
  }

  if (finished) {
    let filteredBooksByFinished = books;

    if (finished === '0') {
      filteredBooksByFinished = books.filter((book) => book.finished === false);
    } else if (finished === '1') {
      filteredBooksByFinished = books.filter((book) => book.finished === true);
    }

    const response = h.response({
      status: 'success',
      data: {
        books: destructureBooks(filteredBooksByFinished),
      },
    });

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: destructureBooks(books),
    },
  });

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);

  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);

    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);

  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
