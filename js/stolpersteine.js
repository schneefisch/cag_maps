var map;
var latStuttgartZentrum = 48.7784485;
var lngStuttgartZentrum = 9.1800132;
var zoom = 15;
var key = "st";
var _stones;

function renderMap() {
    console.log("start rendering map");

    // initialize the map
    map = L.map('map').setView(
            [latStuttgartZentrum, lngStuttgartZentrum],
            zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function loadStonesFromCSVCallback(stones) {
    // add to browser cache
    sessionStorage.setItem(key, stones);
    _stones = stones;
}

function loadStonesFromCSV() {
    $.ajax({
        type: 'GET',
        url: 'res/stolpersteine.csv',
        dataType: 'text',
        success: function(data) {
            // parse data
            var stones = {};
            var allLines = data.split(/\r\n|\n/);
            var expectedDataPerLine = 5;
            // starting with i=1 because the first line (i=0) is the title line
            for (var i=1; i<allLines.length; i++) {
                var l = allLines[i].split(',');
                if (l.lenght == expectedDataPerLine) {
                    // when adding data, start with index 0
                    stones[i-1] = {
                        name: l[0],
                        street: l[1],
                        uri: l[2],
                        lat: l[3],
                        lng: l[4]
                    }
                }
            }
            // call callback method
            loadStonesFromCSVCallback(stones);
        }
    });
}

function loadStonesFromCache() {

    // load from browser-cache if existent
    _stones = sessionStorage.getItem(key);

    // if nothing is in browser-cache, load stones from csv and store in cache
    if (_stones == null) {
        loadStonesFromCSV();
    }
}

function loadStones() {
    if (Modernizr.localstorage) {
        console.log("has local storage");
        loadStonesFromCache();
    } else {
        console.log("no local storage available");
        loadStonesFromCSV();
    }
}


$(document).ready(function() {
    console.log("start rendering map");
    renderMap();
    loadStones();
});