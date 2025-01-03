const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/temp/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept Excel  only
    if (!file.originalname.match(/\.(xlsx|xls|xlsm|csv|xltx|xltm|xlsb|xml)$/)) {
      req.fileValidationError = 'Only Excel files are allowed!';
      return cb(new Error('Only Excel files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload