var streets = L.tileLayer(
'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw',
{
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}
);

var imagery = L.tileLayer(
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
{
    attribution: 'Tiles © Esri'
}
);

var topo = L.tileLayer.wms(
'https://ows.mundialis.de/services/service?',
{
    layers: 'SRTM30-Colored-Hillshade'
}
);



var map = L.map("map", {
    center: [40.62, -97.39],
    zoom: 4,
    layers: [streets]
});

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

L.easyButton('<img src="Home_icon_black.png" height="70%">', function () {
    map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

var wildfires = L.geoJSON(null, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5,
            fillColor: "red",
            color: "darkred",
            weight: 1,
            fillOpacity: 0.8
        });
    }
}).addTo(map);
wildfires.addTo(map);

var airQuality = L.tileLayer(
"https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=413fa902fce2aab54eb47e47c95d3ffa1c696b61"
);
var wind = L.tileLayer(
"https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=b506d0e69b30edeebda75dbf45e30f61"
);


var wildfireUrl = "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson";

fetch(wildfireUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        wildfires.addData(data);
    })
    .catch(function(error) {
        console.error("Wildfire data failed:", error);
    });

var baseLayers = {
    'Satellite Imagery': imagery,
    'Streetmap': streets,
    'Hillshade': topo
};

var overlays = {
    "Wildfires": wildfires,
    "Air Quality": airQuality,
    "Wind": wind
};

L.control.layers(baseLayers, overlays).addTo(map);
airQuality.addTo(map);
wind.addTo(map);
