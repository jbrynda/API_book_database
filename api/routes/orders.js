const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Book = require("../models/book");

router.get("/", (req, res, next) => {
  Order.find()
    .select("book quantity _id")
    .populate("book", "_id name")
    .exec()
    .then((data) => {
      res.status(200).json({
        count: data.length,
        orders: data.map((order) => {
          return {
            _id: order._id,
            book: order.book,
            quantity: order.quantity,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${order._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Book.findById(req.body.bookId)
    .then((book) => {
      if (!book) return res.status(404).json({ message: "Book not found" });
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        book: req.body.bookId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        msg: "Order was created",
        savedOrder: {
          _id: result._id,
          book: result.book,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
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

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("book")
    .exec()
    .then((order) => {
      if (!order) return res.status(404).json({ msg: "Order not found" });
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: "Order delete",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { bookId: "Book ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
