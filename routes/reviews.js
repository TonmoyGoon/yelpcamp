const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utilitis/catchAsync");
const reviews = require("../controllers/reviews");

// Review Model -- Create

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

// Delete

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;