const Author = require("../models/author");

const async = require("async");
const Book = require("../models/book");

//  Display list of authors
exports.author_list = function (req, res, next) {
  Author.find()
    .sort([["family_name", "ascending"]])
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      //  success, render
      res.render("author_list", {
        title: "Author List",
        author_list: list_authors,
      });
    });
};

//  Display detail page of an author
exports.author_detail = (req, res, next) => {
  //  Find author and their books
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        //  No results
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      //  Success, render
      res.render("author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

//  Display create author form on GET
exports.author_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: author create GET");
};

//  Handle create author form on POST
exports.author_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: author create POST");
};

//  Handle delete author form on GET
exports.author_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: author delete GET");
};

//  Handle delete author on POST
exports.author_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: author delete POST");
};

// Display Author update form on GET.
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
