const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const checkAuth = require("../auth/check-auth");

const UserController = require("../controllers/user");

router.post("/signup", UserController.signUp);

router.post("/signin", UserController.signIn);

router.delete("/:userId", checkAuth, UserController.deleteUser);

module.exports = router;

//5:14 pokracujeme
