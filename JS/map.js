/**
 * This represents the datastore class
 *
 */
function DataStoreObject = () {

    // declare private variables

    // create an index of
    var index = {};
    // holds all data
    var data = {};
    // id count
    var lastId = -1;



    /**
     * insert a stone object into the datastore
     * stone = {
            name:"Lilly Abele",
            street:"Karl-Kloß-Str. 42",
            link="http://www.stolpersteine-stuttgart.de/index.php?docid=585&mid=66",
            lat="48.75774999999999",
            lng="9.15907"
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
        // TODO

        // -------------
        // create new id


        // ----------------
        // insert into data


        // -----------------
        // insert into index

        //
     }


    this.getStone = function(id) {
        // TODO
    }


    this.getStones = function(fromLat, toLat, fromLng, toLng) {
        // TODO
    }

} DataStore = new DataStoreObject();


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

            // insert new stonedata into DataStore
            DataStore.insertStone({
                name: tmp[0],
                street: tmp[1],
                link: tmp[2],
                lat: tmp[3],
                lng: tmp[4]
            });
        }
    }

}


// -------------
// stolpersteine und karte

var map, lat, lng;
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
}


function getCurrentUserPosition() {

}


function init() {
    console.log("start initializing");

    // load stolpersteine data
    loadStoneData();

    initMap();
}


