const cloudinaryController = require('../controllers/cloudinary')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = (router) =>{
    router.route('/api/cloudinary')
        .post(upload.single('file'), cloudinaryController.uploadUrls)
}