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
        console.log("update");

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



// -------------
// Klick-Meldungen

var meldungen = [
    "Lass mich gefälligst in Ruhe!!!",
    "Autsch",
    "Es geht nicht schneller!",
    "So ungenau?!",
    "Schnarch*********",
    "Ups",
    "Piep",
    "Oink"
];

function clickCallback(event) {

    // Anzahl, wie viele Meldungen wir haben
    var nr = 8;

    // choose random message
    var index = Math.floor(Math.random() * nr);

    alert(meldungen[index]);
}
