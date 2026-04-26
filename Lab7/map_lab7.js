var mymap = L.map('map', {
    center: [28.9724, 84.5944],
    zoom: 8
});

/* ---------------- BASE LAYER ---------------- */
var streets = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(mymap);

/* ---------------- SCALE BAR ---------------- */
L.control.scale({
    position: 'bottomright',
    metric: true,
    imperial: true
}).addTo(mymap);

/* ---------------- HOME / FULL EXTENT BUTTON ---------------- */
L.easyButton('<img src="images/globe_icon.png" style="width:12px;">', function () {
    mymap.setView([28.9724, 84.5944], 8);
}, 'Zoom to Full Extent').addTo(mymap);

/* ---------------- MINIMAP ---------------- */
var miniBase = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
);

var miniMap = new L.Control.MiniMap(miniBase, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomleft'
}).addTo(mymap);

/* ---------------- ICON ---------------- */
var myIcon = L.icon({
    iconUrl: 'images/peaks.png',
    iconSize: [20, 20],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24]
});

/* ---------------- PEAK MARKERS ---------------- */
var peaks = L.geoJSON(mtn_peaks, {

    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    },

    onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "<b>" + feature.properties.TITLE + "</b><br>" +
            "Height: " + feature.properties.Peak_Heigh + " m<br>" +
            "Deaths: " + feature.properties.number_of_ + "<br>" +
            "Expeditions: " + feature.properties.number_of1
        );
    }

});

/* ---------------- PROPORTIONAL CIRCLES ---------------- */
function getRadius(val) {
    return Math.sqrt(val / Math.PI) * 2;
}

var propcircles = L.geoJSON(mtn_peaks, {

    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.number_of1),
            fillColor: "#920101",
            color: "#920101",
            weight: 1,
            fillOpacity: 0.4
        });
    },

    onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "<b>" + feature.properties.TITLE + "</b><br>" +
            "Expeditions: " + feature.properties.number_of1
        );
    }

});

/* ---------------- HEAT MAP ---------------- */
var heatArray = [];

mtn_peaks.features.forEach(function(feature) {

    var val = feature.properties.number_of_;

    heatArray.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        val
    ]);
});

var heat = L.heatLayer(heatArray, {
    radius: 25,
    minOpacity: 0.5,
    gradient: {
        0.4: 'blue',
        0.65: 'lime',
        1: 'red'
    }
});

/* ---------------- CLUSTER LAYER ---------------- */
var clusters = L.markerClusterGroup();

mtn_peaks.features.forEach(function(feature) {
    var lat = feature.geometry.coordinates[1];
    var lng = feature.geometry.coordinates[0];
    clusters.addLayer(L.marker([lat, lng]));
});

/* ---------------- ADD DEFAULT LAYER ---------------- */
mymap.addLayer(peaks);

/* ---------------- LAYER CONTROL (LEGEND + CHECKBOXES) ---------------- */
var baseMaps = {
    "Streets": streets
};

var overlayMaps = {
    "Peak Markers": peaks,
    "Proportional Circles": propcircles,
    "Heat Map": heat,
    "Clustered Peaks": clusters
};

var legendControl = L.control({ position: 'topright' });

legendControl.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend-box');

    div.innerHTML = `
    <div style="
        background:white;
        padding:10px;
        border-radius:6px;
        box-shadow:0 0 10px rgba(0,0,0,0.2);
        font-size:14px;
        line-height:1.4;
    ">

        <b>Layers</b><br><br>

        <label>
            <input type="checkbox" id="peaksToggle" checked>
            <img src="images/peaks.png" style="width:18px; vertical-align:middle;">
            Location of Himalayan peaks
        </label>
        <br><br>

        <label>
            <input type="checkbox" id="clusterToggle" checked>
            <img src="images/cluster_icon.png" style="width:18px; vertical-align:middle;">
            Clustering of Peaks
        </label>
        <br><br>

        <label>
            <input type="checkbox" id="circleToggle" checked>
            <img src="images/propcircles.png" style="width:18px; vertical-align:middle;">
            Expedition Proprotional Circles
        </label>
        <br><br>

        <label>
            <input type="checkbox" id="heatToggle" checked>
            <img src="images/dead.jpg" style="width:18px; vertical-align:middle;">
            Death Density Heat Map
        </label>

    </div>
    `;

    // prevent map from zooming/dragging when clicking legend
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    return div;
};

legendControl.addTo(mymap);

function setupLayerToggles() {

    document.getElementById("peaksToggle").addEventListener("change", function(e) {
        if (e.target.checked) {
            mymap.addLayer(peaks);
        } else {
            mymap.removeLayer(peaks);
        }
    });

    document.getElementById("clusterToggle").addEventListener("change", function(e) {
        if (e.target.checked) {
            mymap.addLayer(clusters);
        } else {
            mymap.removeLayer(clusters);
        }
    });

    document.getElementById("circleToggle").addEventListener("change", function(e) {
        if (e.target.checked) {
            mymap.addLayer(propcircles);
        } else {
            mymap.removeLayer(propcircles);
        }
    });

    document.getElementById("heatToggle").addEventListener("change", function(e) {
        if (e.target.checked) {
            mymap.addLayer(heat);
        } else {
            mymap.removeLayer(heat);
        }
    });
}

setupLayerToggles();

/* ---------------- SEARCH ---------------- */
var searchControl = new L.Control.Search({
    layer: peaks,
    propertyName: 'TITLE',
    zoom: 12,
    collapsed: false,
    textPlaceholder: 'Search peaks...'
});

mymap.addControl(searchControl);