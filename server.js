var express = require('express');
var app = express();
var server = require('http').Server(app);
var moment = require('moment');
var bodyParser = require('body-parser');
var Sequencer = require('./sequencer');

app.use(express.static('dist/'));
app.use(bodyParser.json());

// Express Api Paths
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', (req, res) => {
  let reqBody = req.body;
  console.log(reqBody);
  Sequencer.sketch(reqBody)
    .then(jsonData => {
      console.log(21, jsonData);
    
      res.json({
        success: true,
        data: jsonData
      })
      console.log('Success! Returning json file response to client.');
    })
    .catch(err => {
      console.log(22, err);
      
      res.json({
        success: false,
        data: []
      })
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
