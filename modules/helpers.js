var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");
var zlib = require('zlib');

var Helpers = {};

Helpers.read = function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, content) => {
            if (err) reject(err);
            resolve(content);
        })
    })
}

Helpers.writeFile = function (path, text) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, 'utf8', err => {
            if (err) reject(err);
            resolve();
        })
    })
}

Helpers.appendFile = function (path, text) {
    return new Promise((resolve, reject) => {
        fs.appendFile(path, text, 'utf8', err => {
            if (err) reject(err);
            resolve();
        })
    })
}

Helpers.download = function (url) {
    return new Promise((resolve, reject) => {

        http.get(url, function (res) {
                res.setEncoding('utf8');
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                    // console.log(data);
                })

                res.on('end', function () {
                    console.log('done');
                    resolve(data);
                })
            })
            .on('error', function (e) {
                console.log(e);
                reject(e);
            });
    });
}


Helpers.downloadWithRequestLib = function (otaObj, bodyParams) {
    var timer = 0;

    var options = {
        method: otaObj.method || 'POST',
        url: otaObj.url,
        headers: otaObj.headers,
        body: bodyParams,
        json: true,
        timeout: 120000
    };

    var timeLapsed = setInterval(() => {
        timer += 1;
        if (timer > 120) clearInterval(timeLapsed);
        console.log('Time lapsed:', otaObj.host, timer, 'secs...');
    }, 1000);

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) reject(error);
            console.log(body);
            clearInterval(timeLapsed);
            resolve(body);
        })
    });
}

Helpers.downloadWithHttpsXml = function (otaObj, bodyParams) {
    var timer = 0;

    var options = {
        hostname: otaObj.host,
        path: otaObj.path || '',
        port: 443,
        method: otaObj.method || 'POST',
        headers: otaObj.headers || {}
    };

    var timeLapsed = setInterval(() => {
        timer += 1;
        if (timer > 120) clearInterval(timeLapsed);
        console.log('Time lapsed:', otaObj.host, timer, 'secs...');
    }, 1000);

    return new Promise((resolve, reject) => {
        var req = https.request(options, (res) => {
            console.log('STATUS: ', res.statusCode);
            console.log('HEADERS: ', JSON.stringify(res.headers));

            var data = '';

            var gunzip = zlib.createGunzip();
            res.pipe(gunzip);

            gunzip.on('data', (chunk) => {
                data += chunk.toString();
            })

            gunzip.on('end', () => {
                console.log('Response done' + '\n');
                clearInterval(timeLapsed);
                resolve(data);
            })

        });

        req.on('error', (err) => {
            console.log(`problem with request: ${err.message}`);
            clearInterval(timeLapsed);
            reject(err);
        });

        if (bodyParams) req.write(bodyParams);
        req.end();
    })
}


Helpers.downloadWithHttps = function (otaObj, bodyParams) {
    var timer = 0;

    var options = {
        hostname: otaObj.host,
        path: otaObj.path || '',
        port: 443,
        method: otaObj.method || 'POST',
        headers: otaObj.headers || {}
    };

    var timeLapsed = setInterval(() => {
        timer += 1;
        if (timer > 120) clearInterval(timeLapsed);
        console.log('Time lapsed:', otaObj.host, timer, 'secs...');
    }, 1000);

    return new Promise((resolve, reject) => {
        var req = https.request(options, (res) => {
            console.log('STATUS: ', res.statusCode);
            console.log('HEADERS: ', JSON.stringify(res.headers));

            var data = '';
            var buffer = [];

            res.on('data', (chunk) => {
                data += chunk;
                console.log(data);
            })

            res.on('end', () => {
                console.log('Response done' + '\n');
                clearInterval(timeLapsed);
                resolve(data);
            })


        });

        req.on('error', (err) => {
            console.log(`problem with request: ${err.message}`);
            clearInterval(timeLapsed);
            reject(err);
        });

        if (bodyParams) req.write(bodyParams);
        req.end();
    })
}

module.exports = Helpers;