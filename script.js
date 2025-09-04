let map, routingControl;
let darkMode = false;
let waypoints = []; // stores start + end
let markers = [];

// Init map
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Default Stockholm

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

  // Routing control (hidden UI)
  routingControl = L.Routing.control({
    waypoints: [],
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null, // Hide default markers
    routeWhileDragging: false
  }).addTo(map);

  routingControl.on("routesfound", function (e) {
    const routes = e.routes[0].instructions;
    const stepsDiv = document.getElementById("steps");
    stepsDiv.innerHTML = "";
    routes.forEach(step => {
      const p = document.createElement("p");
      p.innerHTML = step.text;
      stepsDiv.appendChild(p);
    });
  });

  // Search button
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (!query) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const place = data[0];
          addMarker([place.lat, place.lon], place.display_name);
          map.setView([place.lat, place.lon], 14);
        }
      });
  });

  // Map click = add marker with route option
  map.on("click", (e) => {
    addMarker([e.latlng.lat, e.latlng.lng], "Custom location");
  });

  // Panel collapse/expand
  const panel = document.getElementById("directionsPanel");
  const header = document.getElementById("panelHeader");
  header.addEventListener("click", () => {
    panel.classList.toggle("collapsed");
  });
}

// Add marker with popup "Start Route" / "End Route"
function addMarker(coords, name) {
  const marker = L.marker(coords).addTo(map);
  markers.push(marker);

  const popupContent = document.createElement("div");
  popupContent.innerHTML = `<strong>${name}</strong><br>`;

  const startBtn = document.createElement("button");
  startBtn.textContent = "Start Route";
  startBtn.style.margin = "5px";
  startBtn.onclick = () => setWaypoint(coords, "start");

  const endBtn = document.createElement("button");
  endBtn.textContent = "End Route";
  endBtn.style.margin = "5px";
  endBtn.onclick = () => setWaypoint(coords, "end");

  popupContent.appendChild(startBtn);
  popupContent.appendChild(endBtn);

  marker.bindPopup(popupContent).openPopup();
}

// Assign waypoints
function setWaypoint(coords, type) {
  if (type === "start") {
    waypoints[0] = L.latLng(coords[0], coords[1]);
  } else if (type === "end") {
    waypoints[1] = L.latLng(coords[0], coords[1]);
  }

  if (waypoints[0] && waypoints[1]) {
    routingControl.setWaypoints(waypoints);
  }
}

document.addEventListener("DOMContentLoaded", initMap);
