const fs = require('fs');
const Helpers = require('./modules/helpers');
const EmojiTable = require('./modules/emojiTable');

const HotelShopByCity = require('./services/hotelShopByCity');
const HotelShopByGeo = require('./services/hotelShopByGeo');
const HotelDetails = require('./services/hotelDetails');
const HotelAvail = require('./services/hotelAvail');

// Define user query params (standalone Sequencer hotelShopByCity usage only)
const inDate = '20180501';
const outDate = '20180503';
const numOfGuests = 1;
const radius = 3;
const city = 'Chicago';
const state = 'IL';
const country = 'US';

const scenariosMap = { '0': 'Recommended', '1': 'Fast' };

// THE API SEQUENCING ENGINE
var Sequencer = {};

console.log('Running API Sequencer.\n');

Sequencer.sketch = async function (reqBody) {
    // Logic Layer for handling client API request
    // let inDate = '20180501';
    // let outDate = '20180503';
    // let numGuests = 1;
    // let radius = 3;
    // let city = 'Chicago';
    // let state = 'IL';
    // let country = 'US';
    // let selectedScenarios = [1];

    let inDate = reqBody.inDate.split('-').join();
    let outDate = reqBody.outDate.split('-').join();
    let numGuests = reqBody.numGuests;
    let radius = reqBody.radius;
    let city = reqBody.city;
    let state = reqBody.state;
    let country = reqBody.country;
    let selectedScenarios = reqBody.selectedScenarios;

    let isRecommendedSelected = false;
    let isFastSelected = false;
    let hotelDetailsRes = {};
    let hotelAvailRes = {};


    selectedScenarios.forEach((i, el) => {
        if (i == 'Recommended Flow') isRecommendedSelected = true;
        if (i == 'Fast Flow') isFastSelected = true;
    });

    // Hotel Shop API Call
    let hotelShopRes = await Helpers.downloadWithRequestLib(HotelShopByCity, HotelShopByCity.body(inDate, outDate, numGuests, radius, city, state, country), null);

    // Get hotels with open status only
    let openHotels = hotelShopRes.Properties.PropertyInfo.filter(i => i.status == 'Open');
    let hotelDetailsUrl = openHotels[0].PropertySummary.NextSteps.NextStep[0].value;
    console.log(63, hotelDetailsUrl);

    if (isRecommendedSelected) {
        // Hotel Details API Call
        hotelDetailsRes = await Helpers.downloadWithRequestLib(HotelDetails, HotelDetails.body(hotelDetailsUrl), null);
        let hotelAvailUrl = hotelDetailsRes.PropertyDetail.NextSteps.NextStep[0].value;
        console.log(69, hotelAvailUrl);

        // Hotel Avail API Call
        hotelAvailRes = await Helpers.downloadWithRequestLib(HotelAvail, HotelAvail.body(hotelAvailUrl), null);
        console.log(70, hotelAvailRes.HotelStaysRS);
    }

    if (isFastSelected) {
        let chainCode = openHotels[0].PropertySummary.PropertyKey.chainCode;
        let propertyCode = openHotels[0].PropertySummary.PropertyKey.propertyCode;

        // Hotel Avail API Call
        hotelAvailRes = await Helpers.downloadWithRequestLib(HotelAvail, HotelAvail.bodyExtra(inDate, outDate, numGuests, chainCode, propertyCode), null);
        console.log(71, hotelAvailRes.HotelStaysRS);
    }

    // Consolidate jsons and return to server
    let jsonResArr = [];
    if (isRecommendedSelected) {
        jsonResArr = [hotelShopRes, hotelDetailsRes, hotelAvailRes];
    }
    else jsonResArr = [hotelShopRes, hotelAvailRes];

    return jsonResArr;

};


module.exports = Sequencer;