const Author = require("../models/author");

const async = require("async");
const Book = require("../models/book");

const { body, validationResult } = require("express-validator");

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
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};

//  Handle create author form on POST
exports.author_create_post = [
  //  Validate data
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters"),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  //  Process data
  (req, res, next) => {
    //  Extract errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //  Rerender form noting errors to user
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    }
    //  Data valid
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    //  Save author to database
    author.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(author.url);
    });
  },
];

//  Handle delete author form on GET
exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_book(callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        //  no results
        res.redirect("/catalog/authors");
      }
      //  success
      res.render("author_delete", {
        title: "Delete Author",
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

//  Handle delete author on POST
exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_book(callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      //  success
      if (results.authors_books.length > 0) {
        //  author has books, render as get route and dont delete
        res.render("author_delete", {
          title: "Delete Author",
          author: results.author,
          author_books: results.authors_books,
        });
        return;
      }
      //  Author has no books, delete and return to authors list
      Author.findByIdAndRemove(req.body.authorid, (err) => {
        if (err) {
          return next(err);
        }
        //  W
        res.redirect("/catalog/authors");
      });
    }
  );
};

// Display Author update form on GET.
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
