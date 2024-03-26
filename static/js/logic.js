// Define url for the GeoJSON earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 
// Create map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});
 
// Add tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
 
// Retrieve and add earthquake data to map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

        // Colors for depth
        function mapColor(depth) {
        if (depth >= -10 && depth <= 10) {
            return "#ffcc99"; // Color for depths between -10 and 10
        } else if (depth > 10 && depth <= 30) {
            return "#e0a38f"; // Color for depths between 10 and 30
        } else if (depth > 30 && depth <= 50) {
            return "#c27a85"; // Color for depths between 30 and 50
        } else if (depth > 50 && depth <= 70) {
            return "#ab5c7d"; // Color for depths between 50 and 70
        } else if (depth > 70 && depth <= 90) {
            return "#8c3373"; // Color for depths between 70 and 90
        } else {
            return "#660066"; // Color for depths greater than 90
        }
    }

    // Magnitude size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }
 
        return mag * 4;
    }
 
    // Add earthquake data to map
    L.geoJson(data, {
 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
 
        style: mapStyle,
 
        // Pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
 
        }
    }).addTo(myMap);
 
// Add legend with colors to corrolate with depth
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];
 
  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)
});
