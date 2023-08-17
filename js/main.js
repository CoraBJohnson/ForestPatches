//function to create map
function createMap() {
    var map = L.map('map', {
        center: [43.16, -89.49],
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
    // L.tileLayer(' https://dcimapapps.countyofdane.com/arcgisimg/services/ColorOrtho6Inch2022WEB/ImageServer/tile/{z}/{y}/{x}',{
    //     maxZoom: 20,
    // }).addTo(map);

    //L.tileLayer('https://dnrmaps.wi.gov/arcgis/rest/services/DW_Map_Dynamic/EN_Forest_Land_Cover_WTM_Ext/MapServer/1/{z}/{y}/{x}').addTo(map);

//add the zoom control
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    //call getData function to add data
    getData(map);
}
//-----------end of createMap() ---------------

//calculate color for symbology
function legendColor(attValue) {
    return attValue == "ForestForest" ? '#267300' :
    attValue == "ForestNotForest" ? '#a5f57a' :
    attValue == "NotForestNotForest" ? '#fff1d2' : // Means: if (d >= 1966) return 'green' else…
    attValue == "No Data" ? '#ffffff' : // Note that numbers must be in descending order
    '#654321';
};

//
//             if (feature.properties.Forest_Sta == "ForestForest"){
//                 return attValue == '#267300'
//             } else if (feature.properties.Forest_Sta == "ForestNotForest"){
//                 return attValue == '#a5f57a'
//             } else if (feature.properties.Forest_Sta == "NotForestNotForest"){
//                 return attValue == '#fff1d2'
//             } else {
//                 return attValue == '654321'
//             }
//         }
//     })
// };



function symbol2(data,map) {

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

function createLegend(map, data, attValue) {
    //var attValue= feature.properties.Forest_Sta;
    var legend = L.control( { position: 'bottomleft' } );
    legend.onAdd = function(map) {
        var legendContainer = L.DomUtil.create("div", "legend");
        var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
        var margin;
        L.DomEvent.addListener(legendContainer, 'mousedown', function(e) {
            L.DomEvent.stopPropagation(e);
        });
        $(legendContainer).append("<h2 id='legendTitle'>Forest Patches <br>2010-2022<br></h2>");
        $(legendContainer).append(symbolsContainer);
        //add the color legend inside the existing legend.
        var div = L.DomUtil.create('div', 'colorLegend'),
            grades = ["Continuous Forest Since 2010","Forest in 2010, Not Forest in 2022","Not Forest in 2010, Forest in 2022","Not Forest since 2010"];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=  '<i style="background-color:' + legendColor(grades[i]) + '; border: 2px solid"></i> ' + grades[i] + '<br>';};

        $(legendContainer).append(div);

        return legendContainer;
    };

    legend.addTo(map)};



//Import GeoJSON data
function getData(map){
    //load the data
    var data = $.ajax("data/FP10_22.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = ['Forest since 2010', 'Forest in 2010, Not Forest in 2022', 'Not Forest Since 2010'];

        console.log(data)
        symbol2(response, map);
        createLegend(map, data, attributes);
        }
    });
};


$(document).ready(createMap);