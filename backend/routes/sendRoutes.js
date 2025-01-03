const express = require('express');
const sendEmailsController = require('../controller/sendController');
const upload = require('../middlewares/multer');
const router = express.Router();

// Email sending route
router.post('/send-emails',upload.single("file"), sendEmailsController);

module.exports = router;