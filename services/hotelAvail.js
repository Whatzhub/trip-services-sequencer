const moment = require('moment');

const HotelAvail = {
    host: 'adc-api-np.travelport.com',
    name: 'HotelServices',
    url: 'https://adc-api-np.travelport.com/hotel/availability/v2/offers',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'cache-control': 'no-cache',
        'content-type': 'application/json'
    },
    body: function (origin, destination, checkinDate, checkoutDate, numOfGuests, chainCode, propertyCode) {
        let inDate = checkiDate;
        let outDate = checkoutDate;
        let numGuests = numOfGuests;
        let cc = chainCode;
        let pc = propertyCode;

        /*
            ** Sample
            https://adc-api-np.travelport.com/hotel/availability/v2/offers?checkinDate=20180319&checkoutDate=20180324&numberOfGuests=1&chainCode=HY&propertyCode=09950
        */

        return `https://adc-api-np.travelport.com/hotel/availability/v2/offers?checkinDate=${inDate}&checkoutDate=${outDate}&numberOfGuests=${numGuests}&chainCode=${r}&propertyCode=${pc}`;
    }

};


module.exports = HotelAvail;