const multer = require('multer');

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

module.exports = multer({storage: storage}).single("image");