const express = require("express");
const router = express.Router()

const userController = require('../controllers/user')

router.post('/signin' , userController.createUser );

router.post('/login' , userController.userLogin )


module.exports = router;
