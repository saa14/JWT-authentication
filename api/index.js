const db = require('../db');
const knex = require('knex');
const knexDb = knex({ client: 'pg', connection: 'postgres://localhost:5432/jwt_auth' });

function displayHome(req,res,next){
    res.status(200).json({
        status:'success',
        message:'Home Page'
    })
}
function getAllBooks(req,res,next){
    knexDb.raw('select * FROM books').then(function (data) {
      res.status(200).json({
        status:'success',
        data: data.rows,
        message:'Retrieved all books'
      });
      
    }).catch(function (err) {
      return next(err);
      
    });
}
function getSingleBook(req, res, next) {
    var bookID = parseInt(req.params.id);
    knexDb.raw('select * from books where ID = :bookID', {bookID})
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data.rows,
            message: 'Retrieved ONE book'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  function createBook(req, res, next) {
    req.body.pages = parseInt(req.body.pages);
    knexDb.raw('insert into books(title, author, genre, pages,language)' +
        'values(:title, :author, :genre, :pages,:language)',{
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            pages: req.body.pages,
            language: req.body.language
        }
      )
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one book'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  function updateBook(req, res, next) {
    var bookID = parseInt(req.params.id);
    knexDb.raw('update books set title=:title, author=:author, genre=:genre, pages=:pages, language =:language where ID = :bookID',{
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        pages: req.body.pages,
        language: req.body.language,
        bookID: bookID
    }
  ).then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated book'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  function removeBook(req, res, next) {
    var bookID = parseInt(req.params.id);
    knexDb.raw('delete from books where ID = :bookID', bookID)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: `Removed  book`
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  }

module.exports = {
  displayHome: displayHome,
  getAllBooks: getAllBooks,
  getSingleBook: getSingleBook,
  createBook: createBook,
  updateBook: updateBook,
  removeBook: removeBook
};