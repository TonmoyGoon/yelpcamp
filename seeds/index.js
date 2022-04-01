const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers")

const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => console.log("mongoose connenction open"))
    .catch(err => console.log("An error occuered", err))

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "61f00fe2c796eee22c78a058",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolores facilis, ipsa sunt consectetur cumque aliquid ducimus reiciendis doloribus corrupti ipsum repellendus eaque quos. Animi consectetur eum est sed magni.",
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/doq10wggc/image/upload/v1647184618/YelpCamp/pw8ibomqk7xywnbzemfs.jpg',
                    filename: 'YelpCamp/pw8ibomqk7xywnbzemfs'
                },
                {
                    url: 'https://res.cloudinary.com/doq10wggc/image/upload/v1643473612/YelpCamp/amxi0zkotrfa2yzwdqys.jpg',
                    filename: 'YelpCamp/amxi0zkotrfa2yzwdqys.jpg'
                }
            ]
        })
        await camp.save()
    }
}


seedDb().then(() => {
    db.close();               // mongoose.connection.close   [db=mongoose.connection]
})
