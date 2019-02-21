const express = require("express");
const Post = require('../models/post');
const multer = require('multer');
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const MIME_TYPE_MAP = {
    "image/png": 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if(isValid){
            error = null;
        } else {
            cb(error,"backend/images");
        }
        cb(null,"backend/images");
    },
    filename: (req,file,cb) => {
        const name = file.originalname.split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post( '', checkAuth, multer({storage: storage}).single("image"), (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).send({
            message: "sent successfully",
            post : {
                ...createdPost,
                postId: createdPost._id
            }
            
        });
    });
    
})

router.put( '/:id', checkAuth, multer({storage: storage}).single("image"), (req,res,next) => {
    let imagePath = req.body.imagePath
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    Post.updateOne({_id: req.params.id, creator: req.userData.userId},post).then(result => {
        if(result.nModified > 1){
        res.status(200).send({message: "updated successfully"})
        } else {
            res.status(401).send({message: "unauthorized"})
        }
    })
})

router.get( '',  (req,res,next) => {
    pageSize = +req.query.pageSize;
    currentPage = +req.query.currentPage;
    let fetchedPosts;
    postQuery = Post.find();
    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
    }
    postQuery.then((documents) => {
        fetchedPosts = documents
        return Post.countDocuments();
    })
    .then(count => {
        res.status(200).json({
            message: "fetched successfully",
            posts: fetchedPosts,
            maxPosts: count
        })
    })
    .catch(() => {
        console.log("error while fetching")
    })
    
})

router.get( '/:id',  (req,res,next) => {

    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'page not found'});
        }
    })
})

router.delete("/:id" , checkAuth, (req,res,next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if(result.n > 1){
            res.status(200).json({message: "post deleted"});
        } else {
            res.status(401).send({message: "unauthorized"})
        }
    })
})

module.exports = router;