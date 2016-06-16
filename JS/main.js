// -------------------------
var target;

function removeAllOtherActive() {
    // todo
}

function loadPage(pageName, event) {
    target.empty();
    target.load(pageName);
    $("#bs-navbar").collapse('hide');
    removeAllOtherActive();
    $(event.target).addClass('active');
}

function initializeNavigation() {
    // listen to button-click

    // finde das <div id="include_content"> in welches die Inhalte eingefuegt werden sollen
    target = $("#include_content");
    target.load("HTML/map.html");

    // Home-button
    $("#nav_home").click(function(event) {
        loadPage("HTML/map.html", event);
    });

    // Steine Button
    $("#nav_stones").click(function(event) {
        loadPage("HTML/Liste.html", event);
    });

    // Entwickler Button
    $("#nav_developers").click(function(event) {
        loadPage("HTML/Developers.html", event);
    });

    // Impressum Button
    $(".nav_impressum").click(function(event) {
        loadPage("HTML/impressum.html", event);
    });

    // Kontakt Button
    $(".nav_referenz").click(function(event) {
        loadPage("HTML/datenschutz.html", event);
    });
}




// **************
// maps functionality


// -------------
// stolpersteine und karte

var map, lat, lng;
var latStuttgartZentrum = 48.7784485;
var lngStuttgartZentrum = 9.1800132;
var zoom = 13;

function drawMap() {

    // setze anfangswerte
    lat = latStuttgartZentrum;
    lng = lngStuttgartZentrum;

    initializeLeaflet();
}

/*
    erstelle / initialisiere die Karte
 */
function initializeLeaflet() {

    // get the map and set the focus
    map = L.map('map').setView([lat, lng], zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // lade die Stolpersteine
    loadCSV();
}


/**
 lade die Stolpersteine-Daten von der csv-datei
 */
function loadCSV() {
    $.ajax({
        type: "GET",
        url: "ressources/stolpersteine.csv",
        dataType: "text",
        success: function(data) {
            // callback funktion wenn die
            // csv-datei erfolgreich geladen wurde
            addMarkers(data);
        }
    });
}


/**
    fuege die Stolpersteine als einzelne Marker
    auf der Karte ein
 */
function addMarkers(data) {
    //console.log("stolpersteine daten:");

    // teile beim zeilenumbruch '\n'
    var alleZeilen = data.split(/\r\n|\n/);
    //console.log(alleZeilen);

    // titelzeile
    var titel = alleZeilen[0].split(",");
    //console.log(titel);
    var zeilen = [];

    // hole alle Zeilen und teile beim komma
    for (var i=1; i < alleZeilen.length; i++) {
        var zeile_tmp = alleZeilen[i].split(',');

        // pruefe ob die Zeile die gleiche laenge wie der Titel hat
        if (zeile_tmp.length == titel.length) {
            zeilen.push(zeile_tmp);
        }
    }

    // fuege die Marker hinzu
    for (var i=0; i < zeilen.length; i++) {
        var zeile = zeilen[i];
        var text = '<a target="_blank" href="' + zeile[2] + '">' + zeile[0] + '</a><br>' + zeile[1];
        L.marker([zeile[3],zeile[4]]).addTo(map).bindPopup(text);
    }
}


// -------------
// userposition

var latMaxDist = 0.13;
var lngMaxDist = 0.2;
var userPositionMarker;
var canUseUserPosition = true;
var interval;

function userPosition() {


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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            setUserPositionSuccess,
            setUserPositionError);
    }
}

// callback für userPosition()
function setUserPositionSuccess(pos) {
    console.log("got initial user position:");
    console.log(pos);

    //  abspeichern
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;

//    var userPositionMarker = L.divIcon({className: 'posicon'});
    // you can set .my-div-icon styles in CSS
//    userPositionMarker = L.marker([lat, lng], {icon: userPositionMarker})
//                            .addTo(map);

    console.log("run map.location()");
    map.locate({
            watch: true,
            setView: true,
            maxZoom: 16});

    zoom = 16;
}

// callback für userPosition() FAILURE
function setUserPositionError(err) {
    console.log("SCHEISSE");
    canUseUserPosition = false;
}

//    // fuege einmalig aktuelle position hinzu
//    var myPosition = L.divIcon({className: 'posicon'});
//    // you can set .my-div-icon styles in CSS
//
//    userPositionMarker = L.marker([lat, lng], {icon: myPosition}).addTo(map);
//
//    // update current user position
//    if (!getPositionDenied) {
//        interval = setInterval(function() {
////            console.log("update");
//
//            // check if user denied loading the position
//            if (getPositionDenied) {
//                clearInterval(interval);
//                return;
//            }
//
//            // load position
//            if (navigator.geolocation && !getPositionDenied) {
//                navigator.geolocation.getCurrentPosition(
//                    updateCurrentPositionMarker,
//                    updateCurrentPositionDenied);
//            }
//        }, 5000);
//    }






// ////
// muss weg

var myPositionMarker;
var getPositionDenied = false;


function showPosition(position) {
    console.log("runShowPosition");
    console.log(position);

    // speicher aktuelle nutzerposition
    var userLat = position.coords.latitude;
    var userLng = position.coords.longitude;

    if (isPositionInScope(userLat, userLng)) {
        lat = userLat;
        lng = userLng;
        zoom = 16;
    } else {
        getPositionDenied = true;
    }

    initializeLeaflet();
}

function isPositionInScope(ulat, ulng) {
    // berechne distanz zum stuttgarter Zentrum
    // kirchheim teck: 48.6442169, 9.443775
    //
    // dist:
    var dLat = lat - ulat;
    var dLng = lng - ulng;
    // positiv setzen
    if (dLat < 0) { dLat = -dLat; }
    if (dLng < 0) { dLng = -dLng; }
    console.log("dlat");
    console.log(dLat);
    console.log("dlng");
    console.log(dLng);

//    if (dLat > latMaxDist) {
//        lat =
//    }
}

//const

function errorCB(error) {

    var e = error.code;

    switch(e) {
        case 1:
            console.log("Permission denied");
            getPositionDenied = true;
            break;

        case 2:
            console.log("Position Unavailable");
            break;

        case 3:
            console.log("timeout");
            break;

        default:
            console.log("an unknown error occured");
            console.log(e);
            alert("an unknown error occured");
    }

    initializeLeaflet();
}

function getPosition() {
    console.log("runGetPosition");
    console.log("getPositionDenied");
    console.log(getPositionDenied);
    if (navigator.geolocation && !getPositionDenied) {
        navigator.geolocation.getCurrentPosition(showPosition, errorCB);
    } else {
        getPositionDenied = true;
        console.log("Geolocation is not supported by this browser.");
    }
}

function updateCurrentPositionMarker(pos) {
    console.log("runShowPosition");
    console.log(pos);
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;

    // update marker position
    myPositionMarker.setLatLng(L.latLng(lat, lng));
}

function updateCurrentPositionDenied(err) {
    // stop requesting position in future
    getPositionDenied = true;
    // stop interval
    clearInterval(interval);
}





