const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Book = require("../models/book");
const checkAuth = require("../auth/check-auth");
// localhost:3000/books/asd

const storage = multer.diskStorage({
  //vytvoreni storage pro files
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filter = (req, file, cb) => {
  file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ? cb(null, true)
    : cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15,
  },
  fileFilter: filter,
});

router.get("/", (req, res, next) => {
  Book.find()
    .select("_id name") //vyberu sloupce, ktery chci, aby se zobrazily
    .exec()
    .then((books) => {
      const response = {
        count: books.length, //pocet zaznamu
        books: books.map((book) => {
          return {
            ...book.toObject(), //spead operator
            request: {
              type: "GET",
              url: `http://localhost:3000/books/${book._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("image"), (req, res, next) => {
  //upload jednoho filu tim singlem
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    year: req.body.year,
    image: req.file.path,
  });
  book
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        msg: "Book created",
        createdBook: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .select("-__v") //minus __v - neukaze sloupec
    .exec()
    .then((book) => {
      if (book) {
        res.status(200).json({
          name: book.name,
          year: book.year,
          request: {
            type: "GET",
            url: "http://localhost:3000/books",
          },
        });
        return;
      }
      res.status(404).json({ msg: "Not found" });
    });
});

router.patch("/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;
  const update = {};
  for (const iterator of req.body) {
    //for of
    update[iterator.propName] = iterator.value;
  }
  Book.updateOne({ _id: bookId }, { $set: update })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        msg: "Book updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/books/${bookId}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;

  Book.deleteMany({ _id: bookId })
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: "Book deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
