const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utilitis/catchAsync");
const users = require("../controllers/users");


// Register

router.get("/register", users.renderRegister);
router.post("/register", catchAsync(users.register));

// Login

router.get("/login", users.renderLogin);
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

// Logout

router.get("/logout", users.logout);


module.exports = router;