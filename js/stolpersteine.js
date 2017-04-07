var map;
var latStuttgartZentrum = 48.7784485;
var lngStuttgartZentrum = 9.1800132;
var zoom = 15;

function renderMap() {
    console.log("start rendering map");

    // initialize the map
    map = L.map('map').setView(
            [latStuttgartZentrum, lngStuttgartZentrum],
            zoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}


$(document).ready(function() {
    console.log("start rendering map");
    renderMap();
});