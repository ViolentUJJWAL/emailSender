const express = require('express');
const upload = require('../middlewares/multer');
const router = express.Router();
const {sendEmailsController, downloadFile} = require("../controller/sendController")

// Email sending route
router.post('/send-emails',upload.single("file"), sendEmailsController);
router.get('/download', downloadFile);

module.exports = router;