var express = require('express');
var app = express();
var server = require('http').Server(app);
var moment = require('moment');
var bodyParser = require('body-parser');
var Sequencer = require('./sequencer');

app.use(express.static('dist/'));
app.use(bodyParser.json());

// Post Data Cache
let postDataCache = {};

// Express Api Paths
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', (req, res) => {
  let reqBody = req.body;
  postDataCache = reqBody;
  console.log(18, postDataCache);

  res.json({
    success: true,
    data: []
  })
  console.log('Success! Post data successfully retrieved from client.');
});

app.get('/apiSearch', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  Sequencer.sketch(postDataCache, res)
    .then(_res => {
      console.log(27, _res);
      console.log('Success! Returning json file response to client.');
      return res.status(404).end();

    })
    .catch(err => {
      console.log(36, err);

      res.json({
        success: false,
        data: []
      });
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});
