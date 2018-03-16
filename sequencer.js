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

// Declare functions & global variables
const NS_PER_SEC = 1e9;
let t1 = 0;
let t2 = 0;

let hotelShopEventId = 0;
let recommendedEventId = 0;
let fastEventId = 0;
let hotelShopTimeLapsed = 0;
let recommendedTimeLapsed = 0;
let fastTimeLapsed = 0;

let isRecommendedSelected = false;
let isFastSelected = false;
let hotelDetailsRes = {};
let hotelAvailRes = {};

async function SSE(eventName, apiName, eventId, dataObj, timeLapsed, res) {

    res.write(`event: ${eventName}\n`);
    res.write(`id: ${eventId}\n`);

    var json = {
        "event": apiName,
        "id": eventId,
        "data": dataObj,
        "timeLapsed": timeLapsed
    };
    res.write("data: " + JSON.stringify(json) + "\n\n");
    console.log('server sse msg sent', json);
    await res.flushHeaders();
}

async function endFlow (eventId, res) {
    SSE('HOTEL-API', 'End SSE', 'Done', )
}

async function recommendedFlow(hotelDetails, apiName, hotelDetailsBody, bodyParams, res) {
    // Hotel Details API Call
    t1 = process.hrtime();
    hotelDetailsRes = await Helpers.downloadWithRequestLib(hotelDetails, hotelDetailsBody, null);
    t2 = process.hrtime(t1);
    recommendedTimeLapsed = (t2[0] + t2[1] / NS_PER_SEC).toFixed(2);
    SSE('HOTEL-API', apiName + 'Hotel Details', ++hotelShopEventId, hotelDetailsRes, recommendedTimeLapsed, res);

    let hotelAvailUrl = hotelDetailsRes.PropertyDetail.NextSteps.NextStep[0].value;
    console.log(69, hotelAvailUrl);

    // Hotel Avail API Call
    t1 = process.hrtime();
    hotelAvailRes = await Helpers.downloadWithRequestLib(HotelAvail, HotelAvail.body(hotelAvailUrl), null);
    t2 = process.hrtime(t1);
    recommendedTimeLapsed = (t2[0] + t2[1] / NS_PER_SEC).toFixed(2);
    SSE('HOTEL-API', apiName + 'Hotel Avail', 'Done', hotelAvailRes, recommendedTimeLapsed, res);
    console.log(70, hotelAvailRes.HotelStaysRS);
}

async function fastFlow(hotelAvail, apiName, hotelAvailBody, bodyParams, eventId, res) {
    let eId = '';
    if (eventId != 'All Flow') eId = 'Done'
    else eId = ++fastEventId;
    // Hotel Avail API Call
    t1 = process.hrtime();
    hotelAvailRes = await Helpers.downloadWithRequestLib(HotelAvail, hotelAvailBody, null);
    t2 = process.hrtime(t1);
    fastTimeLapsed = (t2[0] + t2[1] / NS_PER_SEC).toFixed(2);
    SSE('HOTEL-API', apiName + 'Hotel Avail', eId, hotelAvailRes, fastTimeLapsed, res);
    console.log(71, hotelAvailRes.HotelStaysRS);
}

// THE API SEQUENCING ENGINE
var Sequencer = {};

console.log('Running API Sequencer.\n');

Sequencer.sketch = async function (reqBody, resObj) {

    let res = resObj;
    let inDate = reqBody.inDate.split('-').join('');
    let outDate = reqBody.outDate.split('-').join('');
    let numGuests = reqBody.numGuests;
    let radius = reqBody.radius;
    let city = reqBody.city;
    let state = reqBody.state;
    let country = reqBody.country;
    let selectedScenarios = reqBody.selectedScenarios;


    selectedScenarios.forEach((i, el) => {
        if (i == 'Recommended Flow') isRecommendedSelected = true;
        if (i == 'Fast Flow') isFastSelected = true;
    });

    // Hotel Shop API Call
    t1 = process.hrtime();
    let hotelShopRes = await Helpers.downloadWithRequestLib(HotelShopByCity, HotelShopByCity.body(inDate, outDate, numGuests, radius, city, state, country), null);
    t2 = process.hrtime(t1);
    hotelShopTimeLapsed = (t2[0] + t2[1] / NS_PER_SEC).toFixed(2);
    console.log(79, `time took: ${hotelShopTimeLapsed}`);
    // SSE('HOTEL-SHOP', ++hotelShopEventId, hotelShopRes, hotelShopTimeLapsed, res);
    SSE('HOTEL-API', 'Hotel Shop', ++hotelShopEventId, hotelShopRes, hotelShopTimeLapsed, res);

    // Get hotels with open status only
    let openHotels = hotelShopRes.Properties.PropertyInfo.filter(i => i.status == 'Open');
    let hotelDetailsUrl = openHotels[0].PropertySummary.NextSteps.NextStep[0].value;
    let chainCode = openHotels[0].PropertySummary.PropertyKey.chainCode;
    let propertyCode = openHotels[0].PropertySummary.PropertyKey.propertyCode;
    console.log(63, hotelDetailsUrl);

    if (isRecommendedSelected && !isFastSelected) {
        await recommendedFlow(HotelDetails, '', HotelDetails.body(hotelDetailsUrl), null, res);
    }

    if (isFastSelected && !isRecommendedSelected) {
        await fastFlow(HotelAvail, '', HotelAvail.bodyExtra(inDate, outDate, numGuests, chainCode, propertyCode), null, null, res);
    }

    if (isRecommendedSelected && isFastSelected) {
        await Promise.all([
            recommendedFlow(HotelDetails, 'Recommended', HotelDetails.body(hotelDetailsUrl), null, res),
            fastFlow(HotelAvail, 'Fast', HotelAvail.bodyExtra(inDate, outDate, numGuests, chainCode, propertyCode), null, 'All Flow', res)
        ]);
    }

    // Consolidate jsons and 
    let jsonResArr = [];
    if (isRecommendedSelected && !isFastSelected) jsonResArr = [hotelShopRes, hotelDetailsRes, hotelAvailRes];
    if (isFastSelected && !isRecommendedSelected) jsonResArr = [hotelShopRes, hotelAvailRes];
    else jsonResArr = [hotelShopRes, hotelDetailsRes, hotelAvailRes];

    // Reset selected scenarios
    isRecommendedSelected = false;
    isFastSelected = false;

    // return to server & close event streams
    return jsonResArr;

};


module.exports = Sequencer;