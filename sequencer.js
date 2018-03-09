const fs = require('fs');
const Helpers = require('./modules/helpers');
const EmojiTable = require('./modules/emojiTable');

const HotelShopByCity = require('./services/hotelShopByCity');
const HotelShopByGeo = require('./services/hotelShopByGeo');
const HotelAvail = require('./services/hotelAvail');

// Define user query params (standalone Sequencer hotelShopByCity usage only)
const inDate = '20180501';
const outDate = '20180503';
const numOfGuests = 1;
const radius = 3;
const city = 'Chicago';
const state = 'IL';
const country = 'US';

// THE API SEQUENCING ENGINE
var Sequencer = {};

console.log('Running API Sequencer.\n');

Sequencer.sketch = async function(reqBody) {
    // TODO: Logic Layer for handling client API request

};


module.exports = Sequencer;