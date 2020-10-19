const express = require("express");
const app = express();
const multiparty = require("multiparty");
const sharp = require("sharp");
const path = require("path")
const port = 3000

app.set("view engine", "hbs");

app.use("/public", express.static(path.join(__dirname, "public")));

app.get('/', function (request, response) {
    response.render("index.hbs");
});

app.post('/', function (request, response) {
    let form = new multiparty.Form({uploadDir: "public/upload"});
    form.parse(request, function (err, fields, files) {
        if (err) {
            response.status(400).json({'error': err.stack});
        } else {
            // validate input fields or raise error
            let validationErrors = validateData(fields);
            if (validationErrors !== "") {
                return response.status(400).json({'error': validationErrors});
            }

            // validate image
            if (files.image === undefined) {
                return response.status(400).json({'error': 'Image is missing'});
            }
            let image = files.image[0];
            if (image.size === 0) {
                return response.status(400).json({'error': 'Input file contains unsupported image format'});
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
                    .then(() => response.json({'image': `/public/images/${uploadFileName}`}));
            } else if (fields.todo[0] === '2') { // case when we want to crop image
                // crop image and save
                sharp(image.path).extract({
                    top: Number(fields.top[0]),
                    left: Number(fields.left[0]),
                    height: Number(fields.height[0]),
                    width: Number(fields.width[0])
                }).toFile(`public/images/${uploadFileName}`)
                    .then(() => response.json({'image': `/public/images/${uploadFileName}`}));
            }
        }
    });
});

function validateData(fields) {
    let error = "";

    if (fields.todo === undefined || (fields.todo[0] !== '1' && fields.todo[0] !== '2')) {
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

    if (fields.todo === '2' && left === undefined) {
        error += "left is missing. "
    }

    if (fields.todo === '2' && top === undefined) {
        error += "top is missing. "
    }

    return error
}

app.listen(port);