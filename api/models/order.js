const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, //odkaz na book
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderSchema); //vytvoreni modulu book s danym schematem
