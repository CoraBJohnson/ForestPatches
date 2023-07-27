//initialize Leaflet
var map = L.map('map').setView([43.15, -89.49], 12);

//add tile layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

//add reference tile layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
}).addTo(map);

//add the zoom control
L.control.zoom({
    position: 'bottomleft'
}).addTo(map);
