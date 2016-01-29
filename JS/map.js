var map;

function initializeLeaflet() {
    // get the map and set the focus
    map = L.map('map').setView([48.7772,9.1881], 14);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // fuege marker hinzu
    L.marker([48.75774999999999,9.15907])
        .addTo(map)
        .bindPopup('<a href="http://www.stolpersteine-stuttgart.de/index.php?docid=585&mid=66" target="_blank">Lilly Abele</a>');
}