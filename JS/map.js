var map;
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


function initializeLeaflet() {
    // get the map and set the focus
    map = L.map('map').setView([48.7772,9.1881], 14);

//  mapbox url
//  https://api.mapbox.com/styles/v1/froeser/ciiac5ar3009fnqlzcdm8ic25.html?title=true&access_token=pk.eyJ1IjoiZnJvZXNlciIsImEiOiJjaWlhYm0ydmUwMDFsdW9senlyeDBldm1vIn0.0qyTvm5CRWn6IthnGUgnOA#13.000607421381691/48.774683621741616/9.176580894088033/0
//    L.tileLayer('https://api.mapbox.com/styles/v1/froeser/ciiac5ar3009fnqlzcdm8ic25.html?title=true&access_token={accessToken}#{z}/{x}/{y}/0', {
//        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//        maxZoom: 18,
//        id: 'ciiac5ar3009fnqlzcdm8ic25',
//        accessToken: 'pk.eyJ1IjoiZnJvZXNlciIsImEiOiJjaWlhYm0ydmUwMDFsdW9senlyeDBldm1vIn0.0qyTvm5CRWn6IthnGUgnOA'
//    }).addTo(map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([48.7595,9.156939999999999]).addTo(map)
    .bindPopup('<a target="_blank" href="http://www.stolpersteine-stuttgart.de/index.php?docid=748&mid=66">Gottlob Assenheimer <br> Finkenstr. 28</a><br> ')

    L.marker([48.76943,9.16066]).addTo(map)
        .bindPopup('<a target="_blank" href="http://www.stolpersteine-stuttgart.de/index.php?docid=677&mid=66">Ludwig Fleischer <br> Reuchlinstr. 9</a><br> ')
}