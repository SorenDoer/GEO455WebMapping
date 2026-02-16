const map = L.map("map").setView([43.812809378833286, -91.21050607445362], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([43.812809378833286, -91.21050607445362])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>I am Grandad Bluff, the largest of all the La Crosse Bluffs.")
  .openPopup();

