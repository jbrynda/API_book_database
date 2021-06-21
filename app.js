const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./api/routes/books");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect(
  `mongodb+srv://admin:${process.env.MONGODB_PASS}@nodelearning.nj06d.mongodb.net/nodelearning?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//npm install --save mongoose

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); //staticka adresa
app.use(bodyParser.urlencoded({ extended: false })); //nastaveni enkodovani
app.use(bodyParser.json()); //pracuje s jsonem
app.use(cors());
/*
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //povoleni corse

  res.header("Access-Control-Allow-Headers", "*"); //povoleni hlavicek

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});
*/
app.use("/books", bookRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      msg: err.message,
    },
  });
});

/*
app.use((req, res, next) => {
  res.status(200).json({
    msg: "Hello World",
  });
});
*/

module.exports = app;
