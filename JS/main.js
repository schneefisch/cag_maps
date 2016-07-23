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
    "Oink",
    "010101110101010001000110",
    "Salat, Suppe, Schnitzel"
];

function clickCallback(event) {

    // Anzahl, wie viele Meldungen wir haben
    var nr = 10;

    // choose random message
    var index = Math.floor(Math.random() * nr);

    // lösche existierende meldung aus dem div
    document.getElementById("meldungstext").textContent = meldungen[index];

    // mache das div sichtbar
    document.getElementById("meldung").style.display = 'inline';

}

/**
 * schließen der meldungs-box
 */
function closeMessage(event) {
    document.getElementById("meldung").style.display = 'none';
}