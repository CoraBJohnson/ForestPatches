//function to create map
function createMap() {
    var map = L.map('map', {
        center: [43.15, -89.49],
        zoom: 12,
        boxZoom: false,
        doubleClickZoom: false,
        keyboard: false,
        zoomControl: true
    });

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

    //call getData function to add data
    getData(map);

}

//calculate color for symbology
function initColor() {
    //scale factor to adjust symbol size evenly
    return attValue == "ForestForest" ? '#267300' : //forested since 2010
        attValue == "ForestNotForest" ? '#a5f57a' : //forested in 2010 not forest in 22
            attValue == "NotForestNotForest" ? '#fff1d2' ; // not forested since 2010

};

//set style for symbology
function style(feature) {
    return {
        fillColor: initColor(feature.properties.Forest_Status),
        fillColor: '#267300',
        weight: 1,
        opacity: 0.7,
        fillOpacity: 0.7
    };
}

// function for symbology
function symbolize(data, map){
    L.geoJson(data, {
        style:style,
    })
        .addTo(map);
    console.log(data)
};


//Import GeoJSON data
function getData(map){
    //load the data
    var data = $.ajax("data/FP10_22.geojson", {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var attributes = ['Forest_Status'];
            symbolize(response, map);
            //createLegend(map, data, attributes,viztype);
//            moveLegend(viztype);
        }

    });
};


$(document).ready(createMap);