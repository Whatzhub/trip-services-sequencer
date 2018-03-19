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
    backgroundColor: "#FAFBFF",
    loadingHtml: Preloaders.cube
});

// Vue Instance #1 - Home
var home = new Vue({
    data: {
        // EventSource Stream
        es: {},
        // Search Obj
        searchObj: Store.state.input.searchObj,
        // Scenarios Data
        scenarios: Store.state.scenarios.scenarioMap,
        chosenScenarios: [],
        // Home Data
        homeScreen: true,
        codeError: false,
        codeErrorMsg: '',
        // API Diagram Data
        apiDiagram: Store.state.apiDiagram,
        // Loading Text
        loader: false,
        loadingText: 'Loading',
        // Progress Bars & Text
        pBar1: 0,
        sseStats: '',
        // Results Data
        resultsScreen: false,
        isIEBrowser: false,
        jsonObj: Store.state.output.jsonObj,
    },
    mounted: function () {
        console.log('Home screen loaded!');
        loadingScreen.finish();

        // Init Sweet Scroll
        const scroller = new SweetScroll();

        // Inite Scroll Reveal
        window.sr = ScrollReveal({ reset: true });
        sr.reveal('#home-dashboard');

        // init API Diagram
        var d = Diagram.parse(home.apiDiagram.text);
        d.drawSVG('apiDiagram', home.apiDiagram.options);

        // init Ace Code Editor
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/javascript");
        editor.session.setUseWrapMode(true);


        // Listen to Ace Code changes, make updates to API Diagram
        editor.session.on('change', function (delta) {
            var svgEl = document.getElementById('apiDiagram');
            svgEl.innerHTML = '';

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
            home.loader = true;

            // Clear JSON File status
            home.jsonObj.shop.show = false;
            home.jsonObj.shop.link = '';
            home.jsonObj.details.show = false;
            home.jsonObj.details.link = '';
            home.jsonObj.avail.show = false;
            home.jsonObj.avail.link = '';

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
                    home.SSEStart();
                })
                .catch(function (err) {
                    console.log(127, err);
                    home.es.close();
                    home.loader = false;
                    alert('Request failed. Please retry with a non-VPN network.')
                })


        },
        getLoaderText: function () {
            // TODO: Generate a dynamic loading text...

        },
        SSEStart: function () {
            // Clear SSE Stats
            home.sseStats = '';
            home.pBar1 = 0;

            // EventSource Stream
            home.es = new EventSource('/apiSearch');

            // Event Stream Listeners
            home.es.addEventListener('HOTEL-API', function (e) {
                var d = JSON.parse(e.data);
                console.log(132, d);
                home.pBar1 += Math.round(d.timeLapsed);

                // SSE Stats
                var data = `${d.event} took ${d.timeLapsed} secs total.`;
                home.sseStats += data;

                // Create downloadable JSON
                home.createDownloadBtn(d.event, d.data);

                if (e.lastEventId == 'Done') {
                    // Close connection.
                    home.es.close();
                    home.loader = false;
                    return console.log(e, 'connection closed')
                }
            });

            home.es.addEventListener('open', function (e) {
                console.log(e, 'connection opens');
            });

            home.es.addEventListener('error', function (e) {
                console.log(e, 'connection error & closed');
                home.loader = false;
                home.es.close();
            });
        },
        toggleScenario: function (label, name) {
            // Allow single or multipe API scenarios sketching
            console.log(209, label, name);
            var index = this.searchObj.selectedScenarios.indexOf(label);
            if (index > -1) {
                this.searchObj.selectedScenarios.splice(index, 1);
                this.chosenScenarios.splice(index, 1);
            }
            else {
                this.searchObj.selectedScenarios.push(label);
                this.chosenScenarios.push(name);
            }
        },
        validateInput: function () {
            var valid = true;
            Object.keys(this.searchObj).forEach((key) => {
                if (this.searchObj[key] == '' || this.searchObj[key] == null) {
                    valid = false;
                }
            });
            return valid;
        },
        createDownloadBtn: function (fileName, json) {
            var jsonObj = JSON.stringify(json);
            var blob = new Blob([jsonObj], {
                type: "text/json; charset=utf-8"
            });
            if (fileName.indexOf('Shop') > -1 && home.jsonObj.shop.link == '') {
                home.jsonObj.shop.link = URL.createObjectURL(blob);
                home.jsonObj.shop.name = `Hotel_Shop.json`;
                home.jsonObj.shop.show = true;
            }
            if (fileName.indexOf('Details') > -1 && home.jsonObj.details.link == '') {
                home.jsonObj.details.link = URL.createObjectURL(blob);
                home.jsonObj.details.name = `Hotel_Details.json`;
                home.jsonObj.details.show = true;
            }
            if (fileName.indexOf('Avail') > -1 && home.jsonObj.avail.link == '') {
                home.jsonObj.avail.link = URL.createObjectURL(blob);
                home.jsonObj.avail.name = `Hotel_Avail.json`;
                home.jsonObj.avail.show = true;
            }
        },
        downloadJSON: function () {
            // TODO: Create JSON Download File
            console.log(236, 'downloaded JSON');
        },
        calcStats: function (apiResponses) {
            // TODO: Calculate basic stats for each API response time & file size

        }
    }
});


// Mount the Vue Instances
home.$mount('#home');