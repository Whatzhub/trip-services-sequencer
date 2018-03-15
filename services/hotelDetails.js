const moment = require('moment');

const HotelDetails = {
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
        'imageSize': 'L'
    },
    body: function (url) {
        return url;
    },
    cleanJSON: function (jsonData) {
        // Extract nextSteps URL

        return jsonData;
    }

};


module.exports = HotelDetails;