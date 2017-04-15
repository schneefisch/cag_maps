var map;
var latStuttgartZentrum = 48.7784485;
var lngStuttgartZentrum = 9.1800132;
var zoom = 15;
var key = "st";
var _stones;
var markerLayerGroup;

function loadMarkers(minlat, maxlat, minlng, maxlng) {
    console.log('loadMarkers(minlat, maxlat, minlng, maxlng)');

    var selectedStones = new Array();
    for (var i = (_stones.length - 1); i >= 0; i--) {
        // check if stone is inside the bounds
        if (_stones[i].lat >= minlat && _stones[i].lat <= maxlat
            && _stones[i].lng >= minlng && _stones[i].lng >= minlng) {
            selectedStones.push(_stones[i]);
        }
    }
    return selectedStones;
}

function getCurrentView() {
    return map.getBounds();
}

function fillMarkersToMap() {
    var bounds = getCurrentView();
    var markers = loadMarkers(bounds._southWest.lat,
            bounds._northEast.lat,
            bounds._southWest.lng,
            bounds._northEast.lng);
    var markersArray = new Array();
    // for each marker (Stolperstein data-point), create a
    // leaflet Marker and add to the markersArray
    markers.forEach(function (item, index, array) {
        var m = L.marker([item.lat, item.lng]);
        var text;
        if (typeof item.uri === 'undefined' || item.uri === null || item.uri == '') {
            text = item.name + '<br>' + item.street;
        } else {
            text = '<a target="_blank" href="' + item.uri + '">' + item.name + '</a><br>' + item.street;
        }
        m.bindPopup(text);
        markersArray.push(m);
    });
    // create a new LayerGroup from the markers, then we can easily
    // remove all markers again later
    markerLayerGroup = L.layerGroup(markersArray);
    // draw the layergroup to the map
    markerLayerGroup.addTo(map);
}

function loadStonesFromCSVCallback(stones) {
    console.log("loadStonesFromCSVCallback(stones)");
    // add to browser cache
    sessionStorage.setItem(key, JSON.stringify(stones));
    // store in global variable
    _stones = stones;
    fillMarkersToMap();
}

function loadStonesFromCSV() {
    console.log("loadStonesFromCSV()");
    $.ajax({
        type: 'GET',
        url: 'res/stolpersteine.csv',
        dataType: 'text',
        success: function(data) {
            // parse data
            var stones = {};
            stones['length'] = 0;
            var allLines = data.split(/\r\n|\n/);
            var expectedDataPerLine = 5;
            // starting with i=1 because the first line (i=0) is the title line
            for (var i=1; i<allLines.length; i++) {
                var l = allLines[i].split(',');
                if (l.length == expectedDataPerLine) {
                    // when adding data, start with index 0
                    stones[i-1] = {
                        name: l[0],
                        street: l[1],
                        uri: l[2],
                        lat: l[3],
                        lng: l[4]
                    }
                    stones['length'] = stones['length'] + 1;
                }
            }
            // call callback method
            loadStonesFromCSVCallback(stones);
        }
    });
}

function loadStonesFromCache() {
    console.log("loadStonesFromCache()");

    // load from browser-cache if existent
    _stones = JSON.parse(sessionStorage.getItem(key));

    // if nothing is in browser-cache, load stones from csv and store in cache
    if (_stones == null || (Object.keys(_stones).length === 0 && _stones.constructor === Object)) {
        loadStonesFromCSV();
    } else {
        fillMarkersToMap();
    }
}

function loadStones() {
    console.log("loadStones()");

    if (Modernizr.localstorage) {
        console.log("has local storage");
        loadStonesFromCache();
    } else {
        console.log("no local storage available");
        loadStonesFromCSV();
    }
}

/**
 * remove existing markers
 * load markers for current bounding box
 * draw markers
 */
function updateMarkers() {
    console.log('updateMarkers() called');
    markerLayerGroup.clearLayers();
    markerLayerGroup.remove();
    loadStones();
}

function renderMap() {
    console.log("renderMap()");

    // initialize the map
    map = L.map('map').setView(
            [latStuttgartZentrum, lngStuttgartZentrum],
            zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

$(document).ready(function() {
    console.log("start working");
    // render the basic leafletjs map
    renderMap();
    // load the stolpersteine and draw to the map
    loadStones();
    // add listener and redraw the stolpersteine
    map.on('moveend', updateMarkers);
});

// TODO: add info-box in index.html, possibly as modal dialogue

// TODO: fill in the modal dialogue with
// - contact
// - reference who developed this
// - imprint