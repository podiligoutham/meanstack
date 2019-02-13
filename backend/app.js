const express = require('express');
const bodyparser = require('body-parser')
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://goutham:4VCV8ygQBodwsU9p@cluster0-xbvpg.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
.then(() =>{
    console.log("connected to database")
}).catch((err) => {
    // console.log("connection failed")
    console.log(err)
})

app.use(bodyparser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, OPTIONS, DELETE");
    next();
})
// 4VCV8ygQBodwsU9p
app.post( '/api/posts', (req,res,next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    res.status(201).json({
        message: "sent successfully"
    })
})

app.use( '/api/posts',  (req,res,next) => {
    posts = [
        {
            id: "d2edj2eidj",
            title: "first",
            content: " first content"
        },
        {
            id: "sxeixjiex23",
            title: "second",
            content: " second content"
        }
    ]
    res.status(200).json({
        message: "fetched successfully",
        posts:posts
    })
})

module.exports = app;