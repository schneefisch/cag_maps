var map;
function initialize() {

    // Karte laden und definieren welcher Ausschnitt angezeigt wird
    var mapOptions = {
        center: new google.maps.LatLng(48.778735, 9.178244),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    // Marker aus der Liste
    //crd1
    var crd1 = new google.maps.LatLng(48.757743, 9.159263);
    var marker1 = new google.maps.Marker({
        position: crd1,
        map: map,
        animation: google.maps.Animation.DROP
    });

    //crd2
    var crd2 = new google.maps.LatLng();
    var marker2 = new google.maps.Marker({
        position: crd2,
        map: map,
        animation: google.maps.Animation.DROP
    })
    }