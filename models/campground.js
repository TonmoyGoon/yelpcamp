const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

// https://res.cloudinary.com/doq10wggc/image/upload/v1643643597/YelpCamp/jkvyrprlltk7srgqzuas.jpg

const ImageSchema = new Schema({     // To add thumbnail property for displaying small img in edit page to delete the image
    url: String,
    filename: String
})

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],    // 'location.type' must be 'Point'
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`;
})

campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", campgroundSchema)