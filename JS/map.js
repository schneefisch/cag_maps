/**
 * This represents the datastore class
 *
 */
var DataStoreObject = function() {

    // declare private variables

    // holds all data
    var _stones = {};
    // quadranten
    var _quadranten = {};
    // id count
    var _lastId = -1;


    /**
     * insert a stone object into the datastore
     * stone

       var data = {
            "1" : {
                name:"Lilly Abele",
                street:"Karl-Kloß-Str. 42",
                link="http://www.stolpersteine-stuttgart.de/index.php?docid=585&mid=66",
                lat="48.75774999999999",
                lng="9.15907"
                },
            "2" : {}
        }

       we expect a range of lat/lng from
        48.963931, 8.814221
        48.548055, 9.594596

        lat diff ~ 0,4159
        lng diff ~ 0,7804

       inner stuttgart from - to
        48.787822, 9.144107
        48.761471, 9.212379

        lat diff ~ 0,026351
        lng diff ~ 0,068272

       result:
        we should probably differentiate in the index to the third place behind the comma
     */
     this.insertStone = function(stone) {

        // -------------
        // create new id
        _lastId++;
        var id = _lastId;

        var tmpStone = {
                "name": stone.name,
                "street": stone.street,
                "link": stone.link,
                "lat": parseFloat(stone.lat),
                "lng": parseFloat(stone.lng)
        }

        // ----------------
        // insert into data
        _stones[id] = stone;


        // -----------------
        // insert into index (quadrants)

        //TODO
     }


    this.getStones = function(fromLat, toLat, fromLng, toLng) {

        console.log("perform getStones()");

        // sicherstellen, dass die Werte Fliesskommazahlen sind
        var _fromLat = parseFloat(fromLat);
        var _toLat = parseFloat(toLat);
        var _fromLng = parseFloat(fromLng);
        var _toLng = parseFloat(toLng);

        // sicherstellen, dass "from" kleiner ist als "to"
        var _t = 0.0;
        if (_toLat < _fromLat) {
            _t = _toLat;
            _toLat = _fromLat;
            _fromLat = _t;
        }
        if (_toLng < _fromLng) {
            _t = _toLng;
            _toLng = _fromLng;
            _fromLng = _t;
        }

        var result = new Array();

        for(var i = 0; i <= _lastId; i++) {

            // lade jeweils einen stein nach dem anderen
            var _tmp = _stones[i];

            // parse laengen- und breitengrad in fliesskommazahlen
            var _lat = parseFloat(_tmp.lat);
            var _lng = parseFloat(_tmp.lng);

            // pruefe ob der aktuelle stein innerhalb des angegebenen bereichs liegt
            if (_lat >= _fromLat
                    && _lat <= _toLat
                    && _lng >= _fromLng
                    && _lng <= _toLng) {

                // abspeichern in der ergebnissliste
                result.push(_tmp);
            }

        }

        return result;
    }


    this.getAllStones = function() {
        return _stones;
    }
};
//} DataStore = new DataStoreObject();


// ---------------------------------------
// Map methods


function loadStoneData() {

    // load stones
    $.ajax({
        type: "GET",
        url: "ressources/stolpersteine.csv",
        dataType: "text",
        success: function(data) {
            initDataStore(data);
        }
    });
}

var data = new DataStoreObject();

/**
 * get the raw csv-data and parse it into the dataStore
 */
function initDataStore(rawData) {

    var allLines = rawData.split(/\r\n|\n/);

    // title
    var title = allLines[0].split(",");
    // read all lines separately and split into data.
    var lines = [];
    var length = allLines.length;
    for (var i = 1; i < length; i++) {
        var tmp = allLines[i].split(",");
        if (tmp.length == title.length) {
            data.insertStone(
                {
                    "name": tmp[0],
                    "street": tmp[1],
                    "link": tmp[2],
                    "lat": tmp[3],
                    "lng": tmp[4]
                }
            );
        }
    }

    console.log("stored all stones in data");

    // continue with loading everything into the map

    // ToDo:
    // entweder eine kontinuierliche Schleife mit update der Userposition
    // oder wir machen einen "event-listener" für
    // - veränderung des Zooms
    // - verschieben der Karte
    drawMarkers();
}


// -------------
// stolpersteine und karte

var map, markers, lat, lng;
var latStuttgartZentrum = 48.7784485;
var lngStuttgartZentrum = 9.1800132;
var zoom = 13;


function initMap() {
    // setze anfangswerte
    lat = latStuttgartZentrum;
    lng = lngStuttgartZentrum;

    // get the map and set the focus
    map = L.map('map').setView([lat, lng], zoom);

    // add title to map
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    markers = new Array();
}


function drawMarkers() {

    // entferne alle marker
    for (var i=0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }

    // get shown lat/lng
    // von der Karte hole die "bounds", d.h. aussenkante
    var viewBounds = map.getBounds();
    var northEastLat, northEastLng, southWestLat, southWestLng;
    // runde auf die dritte stelle hinter dem komma
    northEastLat = (Math.ceil(viewBounds._northEast.lat * 1000)) / 1000;
    northEastLng = (Math.floor(viewBounds._northEast.lng * 1000)) / 1000;
    southWestLat = (Math.floor(viewBounds._southWest.lat * 1000)) / 1000;
    southWestLng = (Math.ceil(viewBounds._southWest.lng * 1000)) / 1000;

    // TODO:
    // einteilen in einzelne kleiner quadranten

    // TODO:
    // Wenn viele (?) quadranten vorhanden sind, nur einen marker in die mitte mit der anzahl vorhandener marker


    // get stones for lat/lng
    var selectedStones = data.getStones(northEastLat, southWestLat, northEastLng, southWestLng);

    console.log("found following stones");
    console.log(selectedStones);
    console.log(selectedStones.length);

    for( var i=0; i<selectedStones.length; i++) {

        var tmpStone = selectedStones[i];
        console.log(tmpStone);
        var text = '<a target="_blank" href="' + tmpStone.link  + '">' + tmpStone.name + '</a><br>' + tmpStone.street;
        var newMarker = L.marker([tmpStone.lat,tmpStone.lng]);
        markers.push(newMarker);
        newMarker.addTo(map).bindPopup(text);
    }

}


function drawCurrentUserPosition() {

}


function init() {
    console.log("start initializing");

    // load stolpersteine data
    loadStoneData();

    initMap();
}


