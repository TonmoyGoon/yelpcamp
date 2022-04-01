if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require('mongoose');
const expressError = require("./utilitis/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");

const MongoStore = require('connect-mongo');

const mongoSanitize = require('express-mongo-sanitize');

const passport = require("passport");
const LocalStrategy = require("passport-local");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))
app.use(mongoSanitize());

// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 60 * 60   // in second    --  https://github.com/jdesboeufs/connect-mongo#readme
    }),
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/fakeuser", async (req, res) => {
    const user = new User({ email: "abc@gmail.com", username: "abc" });
    const newUser = await User.register(user, "abc");
    res.send(newUser);
})

const review = require("./models/review");
const campground = require("./models/campground");
const db = mongoose.connection;

mongoose.connect(dbUrl)
    .then(() => console.log("mongoose connenction open"))
    .catch(err => console.log("An error occuered", err))

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));

// Homepage
app.get("/", (req, res) => {
    res.render("home");
})

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Not Found

app.all("*", (req, res, next) => {
    next(new expressError("Page not found !!!", 404))
})

// Error handling routes

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Ohh no, something went wrong!!"
    res.status(statusCode).render("error", { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})