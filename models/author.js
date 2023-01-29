const { DateTime } = require("luxon");
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
    fullName = `${this.first_name}, ${this.family_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullName = "";
  }
  return fullName;
});

//  Virtual for author URL
AuthorSchema.virtual("url").get(function () {
  //  Don't use arrow function bc we need "this" object!!
  return `/catalog/author/${this._id}`;
});

//  Virtuals for formatting dates
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("lifespan").get(function () {
  return (
    (this.date_of_birth
      ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
          DateTime.DATE_MED
        )
      : "") +
    " - " +
    (this.date_of_death
      ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
          DateTime.DATE_MED
        )
      : "")
  );
});

module.exports = mongoose.model("Author", AuthorSchema);
