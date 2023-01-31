const Genre = require("../models/genre");

const Book = require("../models/book");
const async = require("async");

const validator = require("express-validator");
const body = validator.body;
const validationResult = validator.validationResult;

// Display list of all Genre.
exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_genres) {
      if (err) {
        return next(err);
      }
      //  success, render
      res.render("genre_list", {
        title: "Genres List",
        genre_list: list_genres,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  //  Basically we are checking for existence of the genre name
  //  and all its associated books (both tasks in parallel)
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        //  No results
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      //  Success, render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
//  The reason we use array is bc we need two middleware functions
// First one to validate data, second to do normal operations
exports.genre_create_post = [
  //  Validate and sanitize name field    //
  //  trim removes whitespace trailing/leading whitespace
  //  islength verifies not empty
  //  escape removes dangerous html characters (ex. convert '<' to ;gt)
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  //  Process request now that field is validated
  (req, res, next) => {
    //  Extract validation errors
    const errors = validationResult(req);
    //  Create Genre object w/ formatted input
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      //  Errors, rerender form reusing valid inputs and throwing error for bad
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      //  Data from form is valid, now check if given genre already exists
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          //  Genre exists, redirect to its page
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
          });
          //  Genre saved successfuly, redirect to its page
          res.redirect(genre.url);
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
