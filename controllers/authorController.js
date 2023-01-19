const Author = require("../models/author");

//  Display list of authors
exports.author_list = (req, res) => {
  res.send("NOT IMPLEMENTED: author list");
};

//  Display detail page of an author
exports.author_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: author detail: ${req.params.id}`);
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
