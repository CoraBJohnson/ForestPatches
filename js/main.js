//initialize Leaflet
var map = L.map('map').setView([51, -0.09], 13);

//add tile layer
L.tileLayer('mapbox://styles/corauserid/clis0erre01p701qpep5n6gx8', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copywright"> OpenStreetMap </a>'
}).addTo(map);
