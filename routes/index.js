const express = require('express');
const router = express.Router();
const multiparty = require("multiparty");
const sharp = require("sharp");
const log = require("./log");

router.get('/', function(req, res){
   res.render('index');
});

router.post('/', function (req, res) {
    let form = new multiparty.Form({uploadDir: "public/upload"});
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.status(400).json({'error': err.stack});
        } else {
            // validate input fields or raise error
            let validationErrors = validateData(fields);
            if (validationErrors !== "") {
                return res.status(400).json({'error': validationErrors});
            }

            // validate image
            if (files.image === undefined) {
                return res.status(400).json({'error': 'Image is missing'});
            }
            let image = files.image[0];
            if (image.size === 0) {
                return res.status(400).json({'error': 'Input file contains unsupported image format'});
            }

            // multiparty package generates file name and saves this file to upload folder
            let uploadFileNameSplit = image.path.split('/'); // split the path of file
            let uploadFileName = uploadFileNameSplit[uploadFileNameSplit.length - 1]; // and get the name and extension
            if (fields.todo[0] === '1') { // case when we want to resize image
                // resize image and save this file to upload folder with the same name
                sharp(image.path).resize({
                    height: Number(fields.height[0]),
                    width: Number(fields.width[0])
                }).toFile(`public/images/${uploadFileName}`)
                    .then(() => res.json({'image': `/public/images/${uploadFileName}`}));
                log.logToFile(`public/upload/${uploadFileName}`, `public/images${uploadFileName}`, 'resize', {
                    height: Number(fields.height[0]),
                    width: Number(fields.width[0])
                });
            } else if (fields.todo[0] === '2') { // case when we want to crop image
                // crop image and save
                sharp(image.path).extract({
                    top: Number(fields.top[0]),
                    left: Number(fields.left[0]),
                    height: Number(fields.height[0]),
                    width: Number(fields.width[0])
                }).toFile(`public/images/${uploadFileName}`)
                    .then(() => res.json({'image': `/public/images/${uploadFileName}`}));
                log.logToFile(`public/upload/${uploadFileName}`, `public/images${uploadFileName}`, 'crop', {
                    top: Number(fields.top[0]),
                    left: Number(fields.left[0]),
                    height: Number(fields.height[0]),
                    width: Number(fields.width[0])
                });
            }
        }
    });
});

function validateData(fields) {
    let error = "";

    if (fields.todo === undefined || (fields.todo[0] != 1 && fields.todo[0] != 2)) {
        error += "todo field doesn't equals 1 or 2 or missing. ";
    }

    if (fields.height === undefined) {
        error += "height is missing. ";
    } else if (isNaN(fields.height[0])) {
        error += "height is not a number. ";
    }

    if (fields.width === undefined) {
        error += "width is missing. ";
    } else if (isNaN(fields.width[0])) {
        error += "width is not a number. ";
    }

    if (fields.todo == 2 && fields.left === undefined) {
        error += "left is missing. "
    }

    if (fields.todo == 2 && fields.top === undefined) {
        error += "top is missing. "
    }

    return error
}

module.exports = router;