const express = require("express");
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.post('/signin' , (req,res,next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(result => {
        res.status(201).json({
            message: "user created",
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error:err
        })
    })
});

router.post('/login' , (req,res,next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if(!user){
            
            return res.status(401).json({
                message:'Auth failed'
            })
        }
        fetchedUser = user
        return (user.password === req.body.password)
    }).then(result => {
        if(!result){
            return res.status(401).json({
                message:'Auth failed'
            })
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                                'secret_this_should_be_longer',
                                {expiresIn: "1h"})
        res.status(200).json({
            token: token
        })
    }).catch(err => {
        return res.status(401).json({
            message:'Auth failed'
        })
    })
})


module.exports = router;