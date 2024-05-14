const Router = require('express');
const adminController = require('../controller/adminController');
const multer = require('multer');
const path = require('path');
const responseMessages = require('../util/responseMessages')
const verifyToken = require('../middleware/verifyToken')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.env.ADMIN_IMAGES}`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage }).array('file');

const adminRoutes = Router();

adminRoutes.post('/add-new-user-type', adminController.addNewUserType)

adminRoutes.post('/save-admin-image', (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(200).json({ message: responseMessages.ErrorUploadFiles, error: err.message,responseCode:1001,  });
        }
        next();
    });
}, adminController.fileUpload);


module.exports = adminRoutes; 