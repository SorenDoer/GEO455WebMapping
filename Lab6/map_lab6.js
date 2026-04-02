// -- Create map
var mymap = L.map("map", {
    center: [51.48882027639122, -0.1028811094342392],
    zoom: 11
});

var grey = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(mymap);

var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});


// MiniMap
var miniMap = new L.Control.MiniMap(miniLayer, {
    toggleDisplay: true,
    minimized: false,
    position: "bottomleft"
}).addTo(mymap);

// Density color function
function getColorDensity(d) {
    return d > 139 ? '#54278f' :
           d > 87  ? '#756bb1' :
           d > 53  ? '#9e9ac8' :
           d > 32  ? '#cbc9e2' :
                     '#f2f0f7';
}

// Language color function
function getColorLanguage(value) {
  return value > 6.450409 ? '#7f2704' : 
         value > 4.432128 ? '#d94801' :
         value > 2.250533 ? '#f16913' :
         value > 0.985702 ? '#fdae6b' :
                            '#feedde';  
}

// Density style function
function styleDensity(feature) {
    return {
        fillColor: getColorDensity(feature.properties.pop_den),
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

// Language style function
function styleLanguage(feature){
    return {
        fillColor: getColorLanguage(feature.properties.l_one_af8_),
        weight: 2,
        opacity: 1,
        color: '#696969',
        fillOpacity: 0.9
    };
}

// Highlight 
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
    weight: 5,
    color: '#666',
    fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

// Reset highlight
function resetDensityHighlight(e) {
  densitylayer.resetStyle(e.target);
  e.target.closePopup();
}

// Reset lang density
function resetLanguageHighlight(e) {
  languagelayer.resetStyle(e.target);
  e.target.closePopup();
}

function onEachDensityFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' + 
    '<span style="color:purple">' + feature.properties.pop_den + ' people/hectares</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetDensityHighlight
  });
}

function onEachLanguageFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' + 
    '<span style="color:purple">' + feature.properties.l_one_af8_ + ' people/hectares</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetLanguageHighlight
  });
}




// Add map data and colors
var densitylayer = L.geoJSON(data, {
    style: styleDensity,
    onEachFeature: onEachDensityFeature
}).addTo(mymap);

// Build legends in side panel
function buildLegendHTML(title, grades, colorFunction) {
  var html = '<div class="legend-title">' + title + '</div>';
  
  for (var i = 0; i <grades.length; i++) {
    var from = grades[i];
    var to = grades[i + i];
    
    html +=
      '<div class="legend-box">' +
      '<span class="legend-color" style="background:' + colorFunction(from + 1) + '"></span>' +
'<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' +
'</div>';
  }
  return html;
}

// Insert density legend into side panel
var densityLegendDiv = document.getElementbyId('density-legend');
if (densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
      'Population Density',
      [0, 32, 53, 87, 139],
      getColorDensity
    );
}

// Add map data and colors
var languagelayer = L.geoJSON(datalang, { style: styleLanguage, onEachFeature: onEachLanguageFeature }).addTo(mymap);

function buildLegendHTML(title, grades, colorFunction) {
  var html = '<div class="legend-title">' + title + '</div>';
  
  for (var i = 0; i < grades.length; i++) {
    var from = grades[i];
    var to = grades[i + 1];
    
    html +=
      '<div class="legend-box">' + 
        '<span class="legend-color" style="background:' + colorFunction(from + 0.5) + '""></span>' + 
        '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' + 
        '</div>';
  }
  
  return html;
}

// Non-English density legend
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
densityLegendDiv.innerHTML = buildLegendHTML(
'Population Density',
[0, 32, 53, 87, 139],
getColorDensity
);
}

// Language legend
var languageLegendDiv = document.getElementById('language-legend');
if (languageLegendDiv) {
  languageLegendDiv.innerHTML = buildLegendHTML(
    'Non-English Speaker Density',
    [0, 0.99, 2.25, 4.43, 6.45],
    getColorLanguage
  );
}

// Layer control

var baseLayers = {
  "Population Density": densitylayer,
  "Non-English Speaker Density": languagelayer
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);