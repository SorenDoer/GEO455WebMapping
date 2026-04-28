var map = L.map("map").setView([41.891683194738846, -96.94130976067943], 5);

var bounds = L.latLngBounds(
    [13.008077314525202, -175.52421977693498],
    [74.05075394059902, -55.114064070646485]
);

map.setMaxBounds(bounds);

map.on("drag", function () {
    map.panInsideBounds(bounds, { animate: false });
});

var streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
var terrain = L.tileLayer.wms("https://ows.mundialis.de/services/service?", {
    layers: "SRTM30-Colored-Hillshade",
    format: "image/png",
    transparent: false,
    attribution: "Mundialis"
});

var wildfireUrl =
"https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson";

var wildfires = L.geoJSON(null, {
    style: () => ({ color: "red", weight: 2, fillOpacity: 0.3 }),

onEachFeature: function (feature, layer) {

    var p = feature.properties;

    var state = p.attr_POOState
        ? p.attr_POOState.replace("US-", "")
        : "N/A";

    layer.bindPopup(
        "<b>" + (p.attr_IncidentName || p.poly_IncidentName || "Unknown") + " Fire</b>" +
        "<br><b>Acres burned:</b> " + (p.attr_FinalAcres || p.attr_IncidentSize || p.poly_GISAcres || "N/A") +
        "<br><b>Location:</b> " +
            (p.attr_POOCounty || "N/A") + ", " + state +
        "<br><b>More info:</b> <a href='#' target='_blank'>More info</a>"
    );
}
}).addTo(map);

$.getJSON(wildfireUrl, function (data) {
    wildfires.addData(data);
    wildfires.bringToFront(); 
});

var airQuality = L.tileLayer(
    "https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=1d640ba6d6ad518acbd561ed96356b46c769ec08"
).addTo(map);

var usaGeo = null;
var maskLayer = null;

function buildMask(usa) {

var world = [
    [[-180,-90],[-180,90],[180,90],[180,-90],[-180,-90]],
    [[-540,-90],[-540,90],[-180,90],[-180,-90],[-540,-90]],
    [[180,-90],[180,90],[540,90],[540,-90],[180,-90]]
];

    var holes = [];

    usa.features.forEach(f => {
        var g = f.geometry;

        if (g.type === "Polygon") holes.push(g.coordinates[0]);
        if (g.type === "MultiPolygon") {
            g.coordinates.forEach(p => holes.push(p[0]));
        }
    });

    var mask = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: world.concat(holes)
        }
    };

    maskLayer = L.geoJSON(mask, {
        style: {
            fillColor: "black",
            fillOpacity: 1,
            color: "black",
            weight: 0
        }
    }).addTo(map);
}

var windLayer = L.layerGroup().addTo(map);

var windPoints = [];
for (var lat = 25; lat <= 49; lat += 10) {
    for (var lng = -124; lng <= -67; lng += 10) {
        windPoints.push({ lat, lng });
    }
}

var maxWindRequests = 35;

function fetchWindPoint(i) {
    if (i >= windPoints.length || i >= maxWindRequests) return;

    var p = windPoints[i];

    fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        p.lat +
        "&longitude=" +
        p.lng +
        "&hourly=wind_speed_10m,wind_direction_10m&timezone=auto"
    )
    .then(r => r.json())
    .then(d => {

        var speed = d.hourly.wind_speed_10m[0];
        var dir = d.hourly.wind_direction_10m[0] || 0;

        L.marker([p.lat, p.lng], {
            icon: L.divIcon({
                className: "",
                html: '<div style="transform:rotate(' + dir + 'deg)">➤</div>'
            })
        }).bindPopup("Wind: " + speed + " m/s").addTo(windLayer);

        setTimeout(() => fetchWindPoint(i + 1), 120);
    })
    .catch(() => setTimeout(() => fetchWindPoint(i + 1), 120));
}

$.getJSON(
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA.geo.json",
    function (data) {
        usaGeo = data;
        buildMask(data);
        fetchWindPoint(0);
    }
);

L.control.layers(
    {
        Street: streets,
        Satellite: satellite,
        Terrain: terrain
    },
    {
        Wildfires: wildfires,
        "Air Quality": airQuality,
        Wind: windLayer
    },
    { collapsed: false, position: "bottomright" }
).addTo(map);

var resetControl = L.control({ position: "bottomright" });

resetControl.onAdd = function () {
    var div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

    div.innerHTML = '<a href="#">🌎</a>';

    L.DomEvent.disableClickPropagation(div);

    div.onclick = function (e) {
        e.preventDefault();
        map.setView([42.90982588686551, -95.68879571979095], 5);
    };

    return div;
};

resetControl.addTo(map);

var aboutControl = L.control({ position: "bottomright" });


