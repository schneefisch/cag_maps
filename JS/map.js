var map;

function initializeLeaflet() {
    // get the map and set the focus
    map = L.map('map').setView([48.7772,9.1881], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function addMarkers(data) {
    console.log("stolpersteine daten:");

    // teile beim zeilenumbruch '\n'
    var alleZeilen = data.split(/\r\n|\n/);
    console.log(alleZeilen);

    // titelzeile
    var titel = alleZeilen[0].split(",");
    console.log(titel);
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


//function initialize() {
//
//    // Karte laden und definieren welcher Ausschnitt angezeigt wird
//    var mapOptions = {
//        center: new google.maps.LatLng(48.778735, 9.178244),
//        zoom: 12,
//        mapTypeId: google.maps.MapTypeId.HYBRID
//    };
//    map = new google.maps.Map(document.getElementById("map_canvas"),
//        mapOptions);
//
//    // Marker aus der Liste
//    //crd1
//    var crd1 = new google.maps.LatLng(48.757743, 9.159263);
//    var marker1 = new google.maps.Marker({
//        position: crd1,
//        map: map,
//        animation: google.maps.Animation.DROP
//    });
//
//    //crd2
//    var crd2 = new google.maps.LatLng();
//    var marker2 = new google.maps.Marker({
//        position: crd2,
//        map: map,
//        animation: google.maps.Animation.DROP
//    })
//}
//



//{"Ludwg Fleischer": {
//        "strasse": "Reuchlinstr. 9",
//        "url": "...",
//        "lat": "asdf"
//    }
//}