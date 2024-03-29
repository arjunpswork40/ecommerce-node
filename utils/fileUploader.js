const { MulterError } = require("multer");
const multer = require("multer");
const extensionMimeMappings = {
  "image/png": "png",
  "image/jpg": "jgp",
  "image/jpeg": "jpeg",
};
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'categoryImage') {
      cb(null, 'uploads/category')
    } else if (file.fieldname === 'subCategoryImage') {
      cb(null, 'uploads/subcategory')
    } else {
      cb(null, 'uploads/advertisement')
    }
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname.replace(/ /g, '_');
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    cb(null, name + '-' + Date.now() + ext);
  }
});

const storageDynamicImages = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, 'uploads/institute-documents')
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname.replace(/ /g, '_');
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    cb(null, name + '-' + Date.now() + ext);
  }
});

const uploadSingleFileWithSizeValidation = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max file size
  },
  fileFilter: function (req, file, cb) {

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/mpeg', 'video/quicktime'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only image and video files are allowed');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    if (file.originalname && file.size > 25 * 1024 * 1024) {
      const error = new Error('File size limit exceeded (max 25MB)');
      error.code = 'LIMIT_FILE_SIZE';
      return cb(error, false);
    }
    cb(null, true);
  }

});

const uploadFilesWithSizeValidationCategory = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 5 MB max file size
  },
  fileFilter: function (req, file, cb) {

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only image files are allowed (png,jpeg and jpg )');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    if (file.originalname && file.size > 25 * 1024 * 1024) {
      const error = new Error('File size limit exceeded (max 5MB)');
      error.code = 'LIMIT_FILE_SIZE';
      return cb(error, false);
    }
    cb(null, true);
  }

});

const docUpload = multer({
  storage: storageDynamicImages,
  limits: {
    fileSize: 15 * 1024 * 1024, // 5 MB max file size
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/png','image/*', 'image/jpeg', 'image/jpg','application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/docx','video/mp4', 'video/quicktime','video/webm', 'application/octet-stream'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only image files are allowed (png,jpeg and jpg )');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    if (file.originalname && file.size > 25 * 1024 * 1024) {
      const error = new Error('File size limit exceeded (max 5MB)');
      error.code = 'LIMIT_FILE_SIZE';
      return cb(error, false);
    }
    cb(null, true);
  }

});

// const uploadMultipleFile = 



module.exports = {
  uploadMultipleFiles: (fileName, allowedExtensions, uploadPath) => {
    console.log('fileName, allowedExtensions, uploadPath==>',fileName, allowedExtensions, uploadPath)
    if (!fs.existsSync(uploadPath)) {
        // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath);
      },
      //set name for uploaded file
      filename: (req, file, cb) => {
        const fileNameParts = file.originalname.split(".");
        console.log('fileNameParts=>',fileNameParts)
        const fileExtension = fileNameParts[fileNameParts.length - 1];
        let newFileName = fileNameParts[0].toLocaleLowerCase()+Math.random();
        newFileName = newFileName.replace(/[^a-zA-Z0-9]/g, '')
        // cb(null, `${fileName}.${fileExtension}`)
        cb(null, newFileName + "." + fileExtension);
      },
    });
    const fileFilter = (req, file, cb) => {
      //check file size type etc
      const mimeType = file.mimetype;
      if (allowedExtensions.includes(mimeType)) {
        cb(null, true);
      } else {
        const selectedFieldName = file.fieldname;
        cb(new Error(selectedFieldName + " : selected file types are not allowed"), false);
      }
    };
    // return multer({ storage, fileFilter });
    const upload = multer({ storage, fileFilter });

    const middlewareFunction = (req, res, next) => {
      console.log('upload=>',fileName)
        // Use .array(fieldName) directly on the multer instance
        upload.array(fileName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(403).json({ error: 'File upload error', message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ error: 'Internal server error', message: err.message });
            }
            next();
        });
    };

    return middlewareFunction;
  },
  uploadSingleFile: (fileName, maxFileSize, allowedExtensions = [], uploadPath) => {
    if (!fs.existsSync(uploadPath)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(uploadPath, { recursive: true });
  }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath);
      },
      //set name for uploaded file
      filename: (req, file, cb) => {
        const fileNameParts = file.originalname.split(".");
        const fileExtension = fileNameParts[fileNameParts.length - 1];
        let newFileName = fileNameParts[0].toLocaleLowerCase()+Math.random();
        newFileName = newFileName.replace(/[^a-zA-Z0-9]/g, '')
    console.log('kkkkkkkkk')

        cb(null, `${newFileName}.${fileExtension}`);
      },
    });
    const fileFilter = (req, file, cb) => {
      //check file size type etc
      const mimeType = file.mimetype;
      if (allowedExtensions.includes(mimeType)) {
        cb(null, true);
      } else {
        const selectedFieldName = file.fieldname;
        cb(new Error(selectedFieldName + " : selected file type not allowed"), false);
      }
    };
    return multer({ storage, fileFilter }).single(fileName);
  },

  uploadSingleFileWithSizeValidation,
  uploadFilesWithSizeValidationCategory,
  docUpload

};
