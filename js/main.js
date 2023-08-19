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
        attribution: '&copy; Esri, Dane County, WI'
    }).addTo(map);

//add reference tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
    }).addTo(map);

    // //add 2022 imagery tile layer
    // L.tileLayer('https://dcimapapps.countyofdane.com/arcgisimg/rest/services/ColorOrtho6Inch2022WEB/ImageServer/tile/{z}/{y}{x}',{
    //     maxZoom: 20,
    // }).addTo(map);

    // // add 2022 imagery
    // L.tileLayer(' https://dcimapapps.countyofdane.com/arcgisimg/services/ColorOrtho6Inch2022WEB/ImageServer/tile/{z}/{y}/{x}',{
    //     maxZoom: 20,
    // }).addTo(map);

    //L.tileLayer('https://dnrmaps.wi.gov/arcgis/rest/services/DW_Map_Dynamic/EN_Forest_Land_Cover_WTM_Ext/MapServer/1/{z}/{y}/{x}').addTo(map);

//add the zoom control
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var OpenStreetMap_DE = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var lyrImagery2010;
    var lyrImagery2022;
    var lyrImagerytest;


    lyrImagery2010 = L.imageOverlay('data/fp2010.png', [[43.279063, -89.619900], [43.017300, -89.342106]], {opacity: 0.7}).addTo(map);
    lyrImagery2022 = L.imageOverlay('data/fp2022.png', [[43.279063, -89.619900], [43.017300, -89.342106]], {opacity: 0.7}).addTo(map);
    //lyrImagerytest = L.imageOverlay('data/Layout.png', [[43.279063, -89.619900], [43.017300, -89.342106]]).addTo(map);


    objOverlays = {
        "2022 Imagery" : lyrImagery2022,
        "2010 Imagery" : lyrImagery2010
    };


    //leaflet layer control
    var baseMaps = {
        'Open Street Map': OpenStreetMap_DE,
        '2022 Imagery': lyrImagery2022,
        '2010 Imagery': lyrImagery2010
    }

    L.control.layers(baseMaps).addTo(map);
    // L.control.layers({
    //     position: 'bottomright'
    // }).addTo(map);

    ctlLayer = L.control.layers(objOverlays).addTo(map);

    //ctlSidebar = L.control.sidebar('side-bar').addTo(map);






    //call getData function to add data
    getData(map);
}
//-----------end of createMap() ---------------

//calculate color for symbology
function legendColor(attValue) {
    //var attValue = feature.properties.Forest_Sta;
    return attValue == 'NotForestNotForest' ? '#d3ccc6':   //descending order from not forest to forest
    attValue == 'ForestNotForest' ? '#deeed5' :
    attValue == 'ForestForest' ? '#c7d6bf' :
    '#654321';
};

//calculate color for symbology
function legendColorBorder(attValue) {
    //var attValue = feature.properties.Forest_Sta;
    return attValue == 'NotForestNotForest' ? '#654321':   //descending order from not forest to forest
        attValue == 'ForestNotForest' ? '#90CF6E' :
            attValue == 'ForestForest' ? '#274E06' :
                '#654321';
};


function legendColor1(data) {

    L.geoJson(data, {
        style: function(feature) {
            switch (feature.properties.Forest_Sta) {
                case 'ForestForest': return {color: "#274E06"};
                case 'ForestNotForest':   return {color: "#90CF6E"};
                case 'NotForestNotForest': return {color: "#654321", fillColor:"#654321" };
            }
        }

    });
};

// function style(feature) {
//     return {
//         fillColor: legendColor(feature.properties.Forest_Sta),
//         opacity: 1,
//         color: "#6E6E6E" ,
//         fillOpacity: 0.7
//     };
// }



function symbol2(data,map) {

    L.geoJson(data, {
        style: function(feature) {
            switch (feature.properties.Forest_Status) {
                case 'ForestForest': return {color: "#274E06"};
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
        $(legendContainer).append("<div id='legendTitle'>Forest Pattern  <br>from 2010 to 2022<br></div>");
        $(legendContainer).append(symbolsContainer);
        //add the color legend inside the existing legend.
        var div = L.DomUtil.create('div', 'colorLegend'),
            grades = ["NotForestNotForest","ForestNotForest","ForestForest"];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=  '<i style="height: 17px; width: 26px; background-color:' + legendColor(grades[i]) + '; border: 3px solid '+ legendColorBorder(grades[i])+ '"></i> ' + grades[i] + '<br>';};


        $(legendContainer).append(div);

        return legendContainer;
    };

    legend.addTo(map)};



//Import GeoJSON data
function getData(map){
    //load the data
    var data = $.ajax("data/fp1022JSON.geojson", {
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