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

var map;
var lat = 48.7772;
var lng = 9.1881;
var zoom = 13;
var myPositionMarker;
var getPositionDenied = false;
var interval;

function showPosition(position) {
    console.log("runShowPosition");
    console.log(position);
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    zoom = 16;
    initializeLeaflet();
}

//const

function errorCB(error) {

    var e = error.code;
    console.log(e);

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
            alert("an unknown error occured");
    }

    initializeLeaflet();
}

function getPosition() {
    console.log("runGetPosition");
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
    myPositionMarker.setLatLng(L.latLng(48.7772, 9.1881));
}

function updateCurrentPositionDenied(err) {
    // stop requesting position in future
    getPositionDenied = true;
    // stop interval
    clearInterval(interval);
}


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

    // fuege einmalig aktuelle position hinzu
    var myPosition = L.divIcon({className: 'posicon'});
    // you can set .my-div-icon styles in CSS

    myPositionMarker = L.marker([lat, lng], {icon: myPosition}).addTo(map);

    // update current user position
    if (!getPositionDenied) {
        interval = setInterval(function() {
//            console.log("update");

            // check if user denied loading the position
            if (getPositionDenied) {
                clearInterval(interval);
                return;
            }

            // load position
            if (navigator.geolocation && !getPositionDenied) {
                navigator.geolocation.getCurrentPosition(
                    updateCurrentPositionMarker,
                    updateCurrentPositionDenied);
            }
        }, 5000);
    }
}

function loadCSV() {
    $.ajax({
        type: "GET",
        url: "ressources/stolpersteine.csv",
        dataType: "text",
        success: function(data) {
            addMarkers(data);
        }
    });
}

function initializeLeaflet() {

    // get the map and set the focus
    map = L.map('map').setView([lat, lng], zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    loadCSV();
}