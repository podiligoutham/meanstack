
const express = require('express');
const bodyparser = require('body-parser')
const path = require('path');

const mongoose = require('mongoose');

const app = express();

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users')

mongoose.connect("mongodb+srv://goutham:MsS8S2AmoUb07UBi@cluster0-stj3s.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true } )
.then(() =>{
    console.log("connected to database")
}).catch(() => {
    console.log("connection failed")
})

app.use(bodyparser.json());
app.use("/images", express.static(path.join("images")))

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, PUT, OPTIONS, DELETE");
    next();
})
// 4VCV8ygQBodwsU9p    MsS8S2AmoUb07UBi
app.use("/api/posts", postRoutes)
app.use("/api/users", userRoutes)

module.exports = app;
