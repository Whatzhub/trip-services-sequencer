const moment = require('moment');

const HotelShopByGeo = {
    host: 'adc-api-np.travelport.com',
    name: 'HotelServices',
    url: 'https://adc-api-np.travelport.com/hotel/shop/v3/properties',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'cache-control': 'no-cache',
        'content-type': 'application/json'
    },
    body: function (origin, destination, checkinDate, checkoutDate, numOfGuests, radius, latitude, longitude) {
        let inDate = checkiDate;
        let outDate = checkoutDate;
        let numGuests = numOfGuests;
        let r = radius;
        let lat = latitude;
        let lon = longitude;

        /*
            ** Sample
            https://adc-api-np.travelport.com/hotel/shop/v3/properties?checkinDate=20180301&checkoutDate=20180303&numberOfGuests=1&radius=5&lat=39.5807&lon=-104.8772
        */

        return `https://adc-api-np.travelport.com/hotel/shop/v3/properties?checkinDate=${inDate}&checkoutDate=${outDate}&numberOfGuests=${numGuests}&radius=${r}&lat=${lat}&lon=${lon}`;
    }

};


module.exports = HotelShopByGeo;