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
    if (Modernizr.localstorage) {
        sessionStorage.setItem(key, JSON.stringify(stones));
    }
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


// -------------
// userposition

var latMaxDist = 0.13;
var lngMaxDist = 0.2;
var userPositionMarker;
var canUseUserPosition = true;
var interval;

/*
    Schritte:

    1. versuche die user-position zu bekommen
    1a: ja      -> 2
    1b: nein    -> exit

    2a: position abspeichern
    2b: marker positionieren
    2c: zoom level anpassen
    2d: karte fokussieren
    3: interval starten -> 4

    4: position erfragen
        -> ok: 5
        -> Nok: stoppe interval
    5: marker updaten

 */
function userPosition() {

    // check if mobile device
    var isMobile = false; //initiate as false
    // device detection
    if(isMobileDevice()) {
        isMobile = true;
        console.log("detected mobile device. activate user-position tracking.");
    } else {
        console.log("detected desktop-browser. deaktivate user-position tracking.");
        canUseUserPosition = false;
    }

    if (isMobile && canUseUserPosition && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            setUserPositionSuccess,
            setUserPositionError);
    }
}

/**
 * check if the current browser is on a mobile device
 */
function isMobileDevice() {
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
        return true;
    }
    return false;
}

// callback für userPosition()
function setUserPositionSuccess(pos) {
    console.log("got initial user position:");
    console.log(pos);

    var ulat = pos.coords.latitude;
    var ulng = pos.coords.longitude;

    if (isPositionInScope(ulat, ulng)) {

        //  abspeichern
        lat = ulat;
        lng = ulng;
        zoom = 16;

        map.setView([lat, lng], zoom);
    }

    userPositionMarker = L.circle([ulat, ulng], (pos.coords.accuracy / 2), {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.3
    }).addTo(map);

    userPositionMarker.on('click', clickCallback);
}

// callback für userPosition() FAILURE
function setUserPositionError(err) {
    console.log("SCHEISSE");
    canUseUserPosition = false;
}

/**
    check if user is close to stuttgart
 */
function isPositionInScope(ulat, ulng) {
    // berechne distanz zum stuttgarter Zentrum§
    // kirchheim teck: 48.6442169, 9.443775
    //
    // dist:
    var dLat = lat - ulat;
    var dLng = lng - ulng;
    // positiv setzen
    if (dLat < 0) { dLat = -dLat; }
    if (dLng < 0) { dLng = -dLng; }

    if (dLat <= latMaxDist && dLng <= lngMaxDist) {
        return true;
    }

    return false;
}

var interval;

function updateUserPositionTrigger() {

    if (!canUseUserPosition) {
        return;
    }

    interval = setInterval(function() {
        // wenn wir, aus welchem Grund auch immer,
        // keine user-position mehr bekommen,
        // hören wir auf das update laufen zu lassen
        if (!canUseUserPosition) {
            clearInterval(interval);
            return;
        }

        // hole koordinaten und update user position
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                updateUserPositionOnInterval,
                stopUpdatingUserPosition
            );
        }
    }, 5000);
}

function updateUserPositionOnInterval(pos) {
    var ulat = pos.coords.latitude;
    var ulng = pos.coords.longitude;
    var uacc = pos.coords.accuracy;

    userPositionMarker.setLatLng([ulat, ulng]);
    userPositionMarker.setRadius(uacc / 2);
}

function stopUpdatingUserPosition() {
    clearInterval(interval);
    return;
}

$(document).ready(function() {
    console.log("start working");
    // render the basic leafletjs map
    renderMap();
    // load the stolpersteine and draw to the map
    loadStones();
    // add listener to map and redraw the stolpersteine
    map.on('moveend', updateMarkers);
    // add user-position
    userPosition();
});

// TODO: find user position
// TODO: draw circle at user position
// TODO: update user-position regularly