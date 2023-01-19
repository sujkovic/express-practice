const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

//  Virtual for author full naame
AuthorSchema.virtual("name").get(function () {
  //  Catch errors in case no last or first name (return empty string)
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.first_name}, ${this.family_name}}`;
  }
  if (!this.first_name || !this.family_name) {
    fullName = "";
  }
  return fullName;
});

//  Virtual for author URL
AuthorSchema.virtual("url").get(function () {
  //  Don't use arrow function bc we need "this" object!!
  return `/catalog/author${this._id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
