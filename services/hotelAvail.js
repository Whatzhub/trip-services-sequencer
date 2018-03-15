const moment = require('moment');

const HotelAvail = {
    host: 'adc-api-np.travelport.com',
    name: 'HotelServices',
    url: 'https://adc-api-np.travelport.com/hotel/availability/hotelStay',
    method: 'GET',
    headers: {
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        // 'cache-control': 'no-cache',
        // 'content-type': 'application/json'
        'accept': 'application/json',
        'Authorization': 'Basic R1dTL1BDQ01PQkxFOk1vYmlsZTIwMTY=, Token tvlport_app_id=travelportAPI-AqDxslUiTZ028olU4KyTJf95',
        'accessProfile': 'DynGalileoCopy_8ZF5'
    },
    body: function (url) {
        return url;
    },
    bodyExtra: function (checkinDate, checkoutDate, numOfGuests, chainCode, propertyCode) {
        let inDate = checkinDate;
        let outDate = checkoutDate;
        let numGuests = numOfGuests;
        let cc = chainCode;
        let pc = propertyCode;

        /*
            ** Sample
            https://adc-api-np.travelport.com/hotel/availability/hotelStay/RC/B7036?checkinDate=20180501&checkoutDate=20180503&numberOfGuests=1&ageQualifyingCode=1
        */

        return `https://adc-api-np.travelport.com/hotel/availability/hotelStay/${cc}/${pc}?checkinDate=${inDate}&checkoutDate=${outDate}&numberOfGuests=${numGuests}&ageQualifyingCode=1`;
    }
};


module.exports = HotelAvail;