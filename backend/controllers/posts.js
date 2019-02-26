const Post = require('../models/post');

exports.createPost = (req,res,next) => {
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
    }).catch(error => {
        res.status(500).json({
            message:'Post creation failed'
        })
    });
    
}

exports.updatePost = (req,res,next) => {
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
        if(result.n > 1){
        res.status(200).send({message: "updated successfully"})
        } else {
            res.status(401).send({message: "unauthorized"})
        }
    }).catch(error => {
        res.status(500).json({
            message:'could not update post'
        })
    })
}

exports.getPosts = (req,res,next) => {
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
        res.status(500).json({
            message:'Fetching posts failed'
        })
    })
    
}

exports.getPost = (req,res,next) => {

    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'page not found'});
        }
    }).catch(() => {
        res.status(500).json({
            message:'Fetching posts failed'
        })
    })
}

exports.deletePost = (req,res,next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if(result.n > 1){
            res.status(200).json({message: "post deleted"});
        } else {
            res.status(401).send({message: "unauthorized"})
        }
    }).catch(() => {
        res.status(500).json({
            message:'Unable to delete post'
        })
    })
}