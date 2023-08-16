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

    // // add 2022 imagery
    // L.tileLayer(' https://dcimapapps.countyofdane.com/arcgisimg/services/ColorOrtho6Inch2022WEB/ImageServer/tile/{z{/{y}/{x}',{
    //     maxZoom: 20,
    // }).addTo(map);



//add the zoom control
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    //call getData function to add data
    getData(map);

}

//calculate color for symbology
// function initColor(attValue) {
//     return attValue == "ForestForest" ? '#267300' : //forested since 2010
//         attValue == "ForestNotForest" ? '#a5f57a' : //forested in 2010 not forest in 22
//             attValue == "NotForestNotForest" ? '#fff1d2' ; // not forested since 2010
//
// };

//set style for symbology
function style(feature) {
    return {
        //fillColor: initColor(feature.properties.Forest_Sta),
        fillColor: '#267300',
        weight: 1,
        opacity: 0.7,
        fillOpacity: 1
    };
}

// var patches = [{
//     "type": "Feature",
//     "properties": {"Forest_Sta": "NotForestNotForest"},
// }, {
//     "type": "Feature",
//     "properties": {"Forest_Sta": "ForestForest"},
//     }, {
//        "type": "Feature",
//        "properties": {"Forest_Sta": "ForestNotForest"}
// }];

function symbol2(data,map) {
    var patches = [{
        "type": "Feature",
        "properties": {"Forest_Sta": "NotForestNotForest"},
    }, {
        "type": "Feature",
        "properties": {"Forest_Sta": "ForestForest"},
    }, {
        "type": "Feature",
        "properties": {"Forest_Sta": "ForestNotForest"}
    }];

    L.geoJson(data, {
        style: function(feature) {
            switch (feature.properties.Forest_Sta) {
                case 'ForestForest': return {color: "#267300"};
                case 'ForestNotForest':   return {color: "#a5f57a"};
                case 'NotForestNotForest': return {color: "#654321", fillColor:"#654321" };
            }
        }
    })
.addTo(map);
};

// function onEachFeature(feature,layer) {
//     var forestStatus = feature.properties.Forest_Sta;
    // var regionName = feature.properties.NAME_1;
    // if (feature.properties.Nov_2022 <= 0) {
    //     var nov22Food = "No Data"} else
    // {var nov22Food = (feature.properties.Nov_2022*100).toFixed(1)+"%"};
    // var femaleEdu = feature.properties.Female_Edu.toFixed(1);
    // var maleEdu = feature.properties.Male_Educa.toFixed(1);
    // var popupContent = '<b>' + regionName + ', ' + countryName + '</b><br>' +
    //     'Insufficient Food Consumption Nov-2022: <b>' + nov22Food+ '</b><br>Female Avg. Years of Educational Attainment: <b>'
    //     + femaleEdu + '</b><br>Male Avg. Years of Educational Attainment: <b>' + maleEdu + '</b><br>Insufficient Food Consumption Trend: ';
//}

// function createLegend(map, data, attributes) {
//     var legend = L.control( { position: 'topleft' } );
//     legend.onAdd = function(map) {
//         var legendContainer = L.DomUtil.create("div", "legend");
//         var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
//         var margin;
//         L.DomEvent.addListener(legendContainer, 'mousedown', function(e) {
//             L.DomEvent.stopPropagation(e);
//         });
//         $(legendContainer).append("<h2 id='legendTitle'>Forest Patches <br>2010-2022<br></h2>");
//         $(legendContainer).append(symbolsContainer);
//         //add the color legend inside the existing legend.
//         //var div = L.DomUtil.create('div', 'colorLegend'),
//             //grades = ["High and Rising IFC, High Edu","High IFC, High Edu","High IFC, Low Edu","Lower  IFC, High Edu","Lower IFC, Low Edu"];
//         // for (var i = 0; i < grades.length; i++) {
//         //     div.innerHTML +=  '<i style="background-color:' + initColor(grades[i]) + '; border: 2px solid '+ legendColorBorder(grades[i])+'"></i> ' + grades[i] + '<br>';};
//
//         //$(legendContainer).append(div);
//
//         return legendContainer;
//     };

    // legend.addTo(map);

//Import GeoJSON data
function getData(map){
    //load the data
    var data = $.ajax("data/FP10_22.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = ['Forest since 2010', 'Forest in 2010, Not Forest in 2022', 'Not Forest Since 2010'];

        console.log(data)
        symbol2(response, map);
        //createLegend(map, data, attributes);
        }
    });
};


$(document).ready(createMap);