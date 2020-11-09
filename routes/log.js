const express = require('express');
const router = express.Router();
const fs = require("fs")

router.get('/', function (request, response) {
    let logs = fs.readFileSync("log.txt", "utf8");
    let logsArray = logs.split('\n');
    if (logsArray[logsArray.length - 1] === '') {
        logsArray.pop()
    }
    let from = request.query.from;
    let to = request.query.to;
    let result = [];
    if (from !== undefined && to !== undefined) {
        logsArray.filter(function (element) {
            let elementObj = JSON.parse(element);
            if ((elementObj.timestamp.split(' ')[0] >= from) && (elementObj.timestamp.split(' ')[0] <= to)) {
                result.push(elementObj);
            }
        });
    }

    if (from !== undefined && to === undefined) {
        logsArray.filter(function (element) {
            console.log(1);
            let elementObj = JSON.parse(element);
            console.log(2);
            if (elementObj.timestamp.split(' ')[0] >= from) {
                result.push(elementObj);
            }
        });
    }

    if (from === undefined && to !== undefined) {
        logsArray.filter(function (element) {
            let elementObj = JSON.parse(element);
            if (elementObj.timestamp.split(' ')[0] <= to) {
                result.push(elementObj);
            }
        });
    }

    if (result.length === 0 && from === undefined && to === undefined) {
        logsArray.forEach(function (element) {
            result.push(JSON.parse(element));
        });
    }

    return response.json({'logs': result});
});

let logToFile = function(upload, output, action, data) {
    let today = new Date();
    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    let log = {upload: upload, output: output, action: action, data: data, timestamp: dateTime}
    fs.appendFile('log.txt',
        JSON.stringify(log) + "\n",
        function (err) {
            if (err) throw err;
        });
}

module.exports = router;
module.exports.logToFile = logToFile;