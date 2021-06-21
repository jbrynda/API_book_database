const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  year: { type: Number, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Book", bookSchema); //vytvoreni modulu book s danym schematem
