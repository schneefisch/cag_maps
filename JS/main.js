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
var zoom = 13

function showPosition(position) {
    console.log("runShowPosition");
    console.log(position);
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    zoom = 13;
    initializeLeaflet()
}

function errorCB(error) {
    console.log("runErrorCheck");
}

function getPosition() {
    console.log("runGetPosition");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, errorCB);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function initializeLeaflet() {

    // get the map and set the focus
    map = L.map('map').setView([lat, lng], zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
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