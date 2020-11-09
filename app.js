const express = require("express");
const app = express();
const path = require("path")

const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');

app.set("view engine", "hbs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/', indexRouter);
app.use('/log', logRouter);

module.exports = app;