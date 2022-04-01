const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const catchAsync = require("../utilitis/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const multer = require('multer')
const { storage } = require("../cloudinary");
const upload = multer({ storage });


// Index 
router.get("/", catchAsync(campgrounds.index));

// Create
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router.post("/", isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));


// show / details 
router.get("/:id", catchAsync(campgrounds.showCampground));

// Update
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
router.put("/:id", isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground));

// Delete
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;