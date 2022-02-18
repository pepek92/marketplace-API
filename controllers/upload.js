const uploadImgRouter = require('express').Router()
var multer = require('multer')
const upload = multer({ dest: 'uploads/' })

uploadImgRouter.post('/', upload.single('image'), function (req, res, next) {
    console.log(req.file)
    res.status(200)
    res.json(req.file)
})

module.exports = uploadImgRouter