// Define the URL for earthquake data
const earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data from the URL
d3.json(earthquakeDataUrl).then(function(data) {
    console.log(data); // Log the retrieved data
    createEarthquakeFeatures(data.features);
});

// Create earthquake markers based on magnitude and depth
function createEarthquakeMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: calculateMarkerSize(feature.properties.mag),
        fillColor: calculateMarkerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.7
    });
}

// Create earthquake features
function createEarthquakeFeatures(earthquakeData) {
    // Define a function for each feature
    function onEachEarthquakeFeature(feature, layer) {
        // Create a popup description for each feature
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3>Depth:</h3> ${feature.geometry.coordinates[2]}<h3>Magnitude:</h3> ${feature.properties.mag}`);
    }

    // Create a GeoJSON layer for earthquake data
    const earthquakeLayer = L.geoJSON(earthquakeData, {
        onEachFeature: onEachEarthquakeFeature,
        pointToLayer: createEarthquakeMarker
    });

    // Send the earthquakeLayer to the createEarthquakeMap function
    createEarthquakeMap(earthquakeLayer);
}

// Create the earthquake map
function createEarthquakeMap(earthquakeLayer) {
    // Create the base layer
    const streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map
    const map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetMapLayer, earthquakeLayer]
    });

    // Create the legend
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        const depth = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + calculateMarkerColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
}

// Calculate marker size based on magnitude
function calculateMarkerSize(magnitude) {
    return magnitude * 5;
}

// Calculate marker color based on depth
function calculateMarkerColor(depth) {
    return depth > 90 ? '#d73027' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#91cf60' :
                        '#1a9850';
}
