// Declare lib modules
import Vue from 'vue';
import moment from 'moment';
import Wait from 'please-wait';
import Pikaday from 'pikaday';
import axios from 'axios';
import ss from 'simple-statistics';

// Declare internal modules
import Store from './js/store';
import Helpers from './js/helpers';
import Preloaders from './js/preloaders';


// Initialise Preloader
var loadingScreen = Wait.pleaseWait({
    logo: "",
    backgroundColor: "#DFDBE5",
    loadingHtml: Preloaders.cube
});

// Initialise Home View
console.log('Home screen is present');

// Vue Instance #1 - Home
var home = new Vue({
    data: {
        // EventSource Stream
        es: {},
        // Search Obj
        searchObj: Store.state.input.searchObj,
        // Scenarios Data
        scenarios: Store.state.scenarios.scenarioMap,
        // Home Data
        homeScreen: true,
        codeError: false,
        codeErrorMsg: '',
        // API Diagram Data
        apiDiagram: Store.state.apiDiagram,
        // Loading Text
        loadingText: 'Loading',

    },
    mounted: function () {
        console.log('Home screen loaded!');
        console.log(this.homeScreen);
        loadingScreen.finish();

        // TODO: init autocomplete datalist for hotel chain input
        // axios.get('json/hotelChainCodes.json')
        //     .then(function (res) {
        //         let dataList = res.data;
        //         let hotelCodeList = [];
        //         for (let i of Object.keys(dataList)) {
        //             hotelCodeList.push({
        //                 label: dataList[i],
        //                 value: i
        //             });
        //         }
        //         new Awesomplete(document.getElementById('destination'), {
        //             list: hotelCodeList,
        //             autoFirst: true
        //         });
        //         new Awesomplete(document.getElementById('origin'), {
        //             list: hotelCodeList,
        //             autoFirst: true
        //         });
        //     })
        //     .catch(function (err) {
        //         console.log(72, err);
        //     });

        // init API Diagram
        var d = Diagram.parse(home.apiDiagram.text);
        d.drawSVG('apiDiagram', home.apiDiagram.options);

        // init Ace Code Editor
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/javascript");
        // editor.resize();

        // Listen to Ace Code changes, make updates to API Diagram
        editor.session.on('change', function (delta) {
            var removeEl = document.querySelectorAll("svg");
            if (removeEl.length != 0) removeEl[0].outerHTML = '';

            try {
                var newInput = editor.getValue();
                var d = Diagram.parse(newInput);
                d.drawSVG('apiDiagram', home.apiDiagram.options);
                home.codeError = false;
            } catch (e) {
                home.codeError = true;
                home.codeErrorMsg = e.message;
                console.log(91, e.message);
            }

        });

        // init datepickers
        var inDatePicker = new Pikaday({
            field: document.getElementById('inDate'),
            firstDay: 1,
            minDate: new Date(),
            maxDate: new Date(2020, 12, 31),
            yearRange: [2017, 2020],
            theme: 'triangle-theme',
            onSelect: function (date) {
                home.searchObj.inDate = moment(date).format('YYYY-MM-DD');
                home.searchObj.outDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
                outDatePicker.show();
                outDatePicker.setDate(home.searchObj.outDate);
            }
        });
        var outDatePicker = new Pikaday({
            field: document.getElementById('outDate'),
            minDate: new Date(),
            maxDate: new Date(2020, 12, 31),
            yearRange: [2017, 2020],
            theme: 'triangle-theme',
            onSelect: function (date) {
                home.searchObj.outDate = moment(date).format('YYYY-MM-DD');
            }
        });

    },
    methods: {
        submitSearch: function (e) {

            // Get latest form input values
            home.searchObj.state = document.getElementById('state').value;
            home.searchObj.city = document.getElementById('city').value;
            home.searchObj.country = document.getElementById('country').value;
            home.searchObj.radius = document.getElementById('radius').value;
            home.searchObj.numGuests = document.getElementById('numGuests').value;
            home.searchObj.inDate = document.getElementById('inDate').value;
            home.searchObj.outDate = document.getElementById('outDate').value;

            console.log(136, home.searchObj);

            // Perform input validation
            var inputValid = this.validateInput();
            if (!inputValid) return alert('You got to fill in your fields!');

            // Enable simple animation for loading text
            var loaderTimer = setInterval(function () {
                console.log(118, home.loadingText);
                if (home.loadingText.length > 10) home.loadingText = 'Loading';
                home.loadingText += '.';
            }, 500);

            // Send submit request      
            var config = {
                method: 'post',
                url: '/search',
                data: home.searchObj
            };

            axios.request(config)
                .then(function (res) {
                    if (!res.data.success) throw new Error('Request failed');
                    console.log(189, res.data.success);
                    clearInterval(loaderTimer);
                    home.SSEStart();
                })
                .catch(function (err) {
                    console.log(127, err);
                    home.es.close();
                    alert('Request failed. Please retry with a non-VPN network.')
                })


        },
        getLoaderText: function () {
            // TODO: Generate a dynamic loading text...

        },
        SSEStart: function () {
            // Clear SSE Stats
            results.sseStats = '';
            results.pBar1 = 0;

            // EventSource Stream
            home.es = new EventSource('/apiSearch');

            // Event Stream Listeners
            home.es.addEventListener('HOTEL-API', function (e) {
                var d = JSON.parse(e.data);
                console.log(132, d);
                results.pBar1 += Math.round(d.timeLapsed);

                // SSE Stats
                var data = `${d.event} took ${d.timeLapsed} secs total.`;
                results.sseStats += data;

                if (e.lastEventId == 'Done') {
                    // Close connection.
                    home.es.close();
                    return console.log(e, 'connection closed')
                }
            });

            home.es.addEventListener('open', function (e) {
                console.log(e, 'connection opens');
            });

            home.es.addEventListener('error', function (e) {
                console.log(e, 'connection error & closed');
                home.es.close();
            });
        },
        toggleScenario: function (id) {
            // Allow single or multipe API scenarios sketching
            console.log(209, id);
            var index = this.searchObj.selectedScenarios.indexOf(id);
            if (index > -1) this.searchObj.selectedScenarios.splice(index, 1);
            else this.searchObj.selectedScenarios.push(id);
        },
        validateInput: function () {
            var valid = true;
            Object.keys(this.searchObj).forEach((key) => {
                if (this.searchObj[key] == '' || this.searchObj[key] == null) {
                    valid = false;
                }
            });
            return valid;
        }
    }
});


// Vue Instance #2 - Results
var results = new Vue({
    data: {
        // Results Data
        resultsScreen: false,
        isIEBrowser: false,
        searchObj: {},
        jsonLink: '',
        jsonName: '',
        jsonData: {},
        // Progress Bars & Text
        pBar1: 0,
        sseStats: ''
    },
    mounted: function () {
        console.log('Results screen loaded!');
    },
    methods: {
        createDownloadBtn: function (csvArr) {
            // TODO: Create Download JSON Button
        },
        downloadJSON: function () {
            // TODO: Create JSON Download File
        },
        calcStats: function (apiResponses) {
            // TODO: Calculate basic stats for each API response time & file size

        }
    }
});


// Mount the Vue Instances
home.$mount('#home');
results.$mount('#results');