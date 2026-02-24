const map = L.map("map").setView([43.56851880995411, -116.2902501323134], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 5,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon4 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon5 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon8 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon9 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon10 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon11 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon12 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});

var GNP = L.marker([48.77196847768131, -113.79183384940235])
  .addTo(map)
  .bindPopup("<b>Glacier National Park")
  .openPopup();

var vashon = L.marker([47.4227453, -122.4756722])
  .addTo(map)
  .bindPopup("<b>Vashon Island")
  .openPopup();

var rainier = L.marker([46.85282244, -121.766365146106])
  .addTo(map)
  .bindPopup("<b>Mount Rainier")
  .openPopup();

var portland = L.marker([45.51646544, -122.6697931])
  .addTo(map)
  .bindPopup("<b>Portland")
  .openPopup();

var eureka = L.marker([40.80109572, -124.1480268])
  .addTo(map)
  .bindPopup("<b>Eureka")
  .openPopup();

var burney = L.marker([41.01225773, -121.6520213])
  .addTo(map)
  .bindPopup("<b>Burney Falls")
  .openPopup();

var lassen = L.marker([40.4907433, -121.5056231])
  .addTo(map)
  .bindPopup("<b>Lassen Peak")
  .openPopup();

var reno = L.marker([39.53623364, -119.7800493])
  .addTo(map)
  .bindPopup("<b>Reno")
  .openPopup();

var tahoe = L.marker([39.08368912, -120.0419405])
  .addTo(map)
  .bindPopup("<b>Lake Tahoe")
  .openPopup();

var bishop = L.marker([37.36812247, -118.4405931])
  .addTo(map)
  .bindPopup("<b>Bishop")
  .openPopup();

var moab = L.marker([38.56806025, -109.5165922])
  .addTo(map)
  .bindPopup("<b>Mount Rainier")
  .openPopup();

var chihushus = L.marker([39.63989249, -105.8465971])
  .addTo(map)
  .bindPopup("<b>Chihuahua Lake")
  .openPopup();
