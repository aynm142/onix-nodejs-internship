const express = require("express");
const app = express();
const path = require("path")

const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');

app.set("view engine", "hbs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/', indexRouter);
app.use('/log', logRouter);

const fs = require('fs');
const dir = './public';
const uploadDir = './public/upload';
const imagesDir = './public/images';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }

}

module.exports = app;