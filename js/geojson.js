//function to create sequence controls
function createSequenceControls(map, attributes){
    //create range input element/slider
    $('#panel').append('<input class = "range-slider" type = "range" >');
    // add slider attributes
    $('.range-slider').attr({
        max: 15,
        min:0,
        value: 0,
        step: 1
    });

    //add skip buttons
    $('#panel').append('<button class="skip" id ="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id ="forward">Skip</button>');

};

//create markers
var geojsonMarkerOptions = {
    radius: 8,
    color: "#d38b18",
    fillColor: "#FFD580",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.8
    };


//function to calculate the radius for each proportional symbol
function calcPropRadius(attValue){
    //scale factor to adjust symbol size evenly
    var scaleFactor=1000;
    //scaled value/area based on attribute value and scale factor
    var area= attValue / scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};
//function to create map with tile layer
function createMap() {
    var map = L.map('map', {
        center: [38, -98],
        zoom: 4,
        boxZoom: false,
        doubleClickZoom: false,
        keyboard: false,
        zoomControl: true
    });
    //add osm base tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copywright"> OpenStreetMap </a>'
    }).addTo(map);
    //call getData function within the create map function to add data to map
    getData(map);

};

//create getData function to get data and place it one the map
function getData(map) {
    //determine attribute to visualize with proportional symbols
    var attribute = "original_AV0AA1970"

    //load the data with ajax
    $.ajax("data/citypoints.geojson",
        {
            dataType: "json",
            success: function (data) {
                //create leaflet GeoJson layer with markers and add it to the map
                L.geoJson(data, {
                    pointToLayer: function (feature, latlng) {
                        //for each feature, determine value for attribute
                        var attValue = Number(feature.properties[attribute]);
                        //examine attribute value to check that it is correct
                        console.log(feature.properties, attValue);
                        //give each feature's marker a radius based on attribute value
                        geojsonMarkerOptions.radius = calcPropRadius(attValue);
                        //create layer with marker options
                        var layer = L.circleMarker(latlng, geojsonMarkerOptions);
                        //create attributes array
                        //var attributes = processData(response);

                        //add panel content string
                        var panelContent = "<p><b>City: </b>" + feature.properties.city + "</p>";

                        //add formated attribute to panel content string
                        var year = attribute.split("AA")[1];
                        panelContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " </p>";

                        //create popup content string
                        var popupContent = feature.properties.city;
                        //bind popups to circle markers
                        layer.bindPopup(popupContent)

                        //listeners to open popup on hover
                        layer.on({
                            mouseover: function () {
                                this.openPopup();
                            },
                            mouseout: function () {
                                this.closePopup()
                            },
                            click: function(){
                                $("#panel").html(panelContent);
                            }
                        });
                        createSequenceControls(map, year);
                        //return circle markers to L.geoJson pointToLayer
                        return layer;

                    }
                }).addTo(map);
            }
        });
};

$(document).ready(createMap);








