const moment = require('moment');

const HotelShopByCity = {
    host: 'adc-api-np.travelport.com',
    name: 'HotelServices',
    url: 'https://adc-api-np.travelport.com/hotel/shop/v3/properties',
    method: 'GET',
    headers: {
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        // 'cache-control': 'no-cache',
        // 'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Basic R1dTL1BDQ01PQkxFOk1vYmlsZTIwMTY=, Token tvlport_app_id=travelportAPI-AqDxslUiTZ028olU4KyTJf95',
        'accessProfile': 'DynGalileoCopy_8ZF5',
        'hotelContent': 'yes', // Set to no if you do not want an image returned in the shop response
        'imageSize': 'L',
        'sort': 'distance' // Valid values = distance, rating
    },
    body: function (checkinDate, checkoutDate, numOfGuests, radius, cityName, stateCode, countryCode) {
        let inDate = checkinDate;
        let outDate = checkoutDate;
        let numGuests = numOfGuests;
        let r = radius;
        let city = cityName;
        let sc = stateCode;
        let cc = countryCode;

        /*
            ** Sample
            https://adc-api-np.travelport.com/hotel/shop/v3/properties?checkinDate=20180301&checkoutDate=20180303&numberOfGuests=1&radius=3&city=chicago&state=IL&country=US
        */

        return `https://adc-api-np.travelport.com/hotel/shop/v3/properties?checkinDate=${inDate}&checkoutDate=${outDate}&numberOfGuests=${numGuests}&radius=${r}&city=${city}&state=${sc}&country=${cc}`;
    },
    cleanJSON: function (jsonData) {
        // Extract nextSteps URL

        return jsonData;
    }

};


module.exports = HotelShopByCity;