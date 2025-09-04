let map, routingControl;
let darkMode = false;

// Init map
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Default: Stockholm

  // Base layers
  const lightTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
  }).addTo(map);

  const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OSM &copy; Carto"
  });

  // Dark mode toggle
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    if (darkMode) {
      map.removeLayer(darkTiles);
      map.addLayer(lightTiles);
      document.body.classList.remove("dark");
    } else {
      map.removeLayer(lightTiles);
      map.addLayer(darkTiles);
      document.body.classList.add("dark");
    }
    darkMode = !darkMode;
  });

  // Geolocation
  document.getElementById("locateBtn").addEventListener("click", () => {
    map.locate({ setView: true, maxZoom: 16 });
  });

  // Routing
  routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim(),
    showAlternatives: true
  }).addTo(map);

  routingControl.on("routesfound", function(e) {
    const routes = e.routes[0].instructions;
    const stepsDiv = document.getElementById("steps");
    stepsDiv.innerHTML = "";
    routes.forEach(step => {
      const p = document.createElement("p");
      p.innerHTML = step.text;
      stepsDiv.appendChild(p);
    });
  });

  // Search
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (!query) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const place = data[0];
          map.setView([place.lat, place.lon], 14);
          L.marker([place.lat, place.lon]).addTo(map)
            .bindPopup(place.display_name)
            .openPopup();
        }
      });
  });

  // Panel drag collapse/expand
  const panel = document.getElementById("directionsPanel");
  const header = document.getElementById("panelHeader");
  header.addEventListener("click", () => {
    panel.classList.toggle("collapsed");
  });
}

document.addEventListener("DOMContentLoaded", initMap);
