const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Place = require("./models/Places.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Booking = require("./models/Booking.js");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "jbcbskadbcbsdhcbsk";  //random numbers

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
const photoMiddleWare = multer({ dest: 'uploads' });

app.use(cors({
    credentials: true,
    origin: "http://localhost:4000/",
}));

mongoose.connect("mongodb+srv://Muhammad-Bilal:tNUjtVyp9a4reGKe@cluster0.8zpya3i.mongodb.net/");

// app.get("/", (req, res) => {
//     res.send("air bnb project");
// });

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userDoc);
    }
    catch (e) {

        res.status(422).json(e); //unprocessable entity

    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const pass = bcrypt.compareSync(password, userDoc.password);
        if (pass) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        }
        else {
            res.status(422).json("invalid credentials");
        }
    }
    else {
        res.json("user not found");
    }
});

app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, data) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(data.id);
            res.json({ name, email, _id });
        })
    }
    else {
        res.json("invalid token");
    }
});

app.post("/logout", (req, res) => {
    res.cookie('token', '').json(true);
});

app.post("upload-by-link", async (req, res) => {
    const { link } = req.body;
    const name = 'image' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads' + name,
    });
    res.json(name);
});

app.post("/upload", photoMiddleWare.array('photos', 10), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalName } = req.files;
        const parts = originalName.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('/uploads', ''));
    }
    res.json(uploadedFiles);
});

app.post("/places", async (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuest, price } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, data) => {
            if (err) throw err;
            const placeDoc = await Place.create({
                owner: data._id,
                price,
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuest,
            });
            res.json(placeDoc);
        })
    }
    else {
        res.json("invalid token");
    }
});

app.get("/user-places", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
        const { id } = data._id;
        res.json(await Place.find({ owner: id }));
    });
});

app.get("/places/:id", async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuest, price } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
    if(err) throw err;
    const placeDoc = await Place.findById(id);
    if(data._id === placeDoc.owner.toString()){
        placeDoc.set({
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuest,
            price,
        });
        placeDoc.save();
        res.json("updated");
    }
    });

});

app.get("/places", async (req,res)=>{
    res.json(await Place.find());
});

app.post("/booking", (req,res)=>{
    const{place,checkIn,checkOut,numberOfGuests,name,phone,price} = req.body;
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
        if(err) throw err;
        Booking.create({
            place,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            user: data.id,
        })
    .then((data)=>{
        res.json(data);
    }).catch((err)=>{
        throw err;
    });
    
    });
    
});

app.get("/bookings", async (req,res)=>{
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
        if(err) throw err;
        res.json(await Booking.find({user:data.id}).populate('place'));
    });

});


//mongo pass 6b27VYhT4XR00XcJ

app.listen(4000);