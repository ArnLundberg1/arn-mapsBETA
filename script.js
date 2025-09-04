let map, userMarker, destinationMarker, routeLine;
let followUser = true;
let currentPosition = null;
let destination = null;
let arrowMarker = null;

function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13); // fallback: Stockholm

  // Light + dark mode layers
  const lightTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
  }).addTo(map);

  const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OSM &copy; Carto"
  });

  let darkMode = false;
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

  // Locate manually
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (currentPosition) {
      map.setView(currentPosition, 16);
    }
  });

  // Toggle follow
  document.getElementById("followBtn").addEventListener("click", () => {
    followUser = !followUser;
  });

  // Search
  document.getElementById("searchBtn").addEventListener("click", searchLocation);
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchLocation();
  });

  // Start live GPS tracking
  startTracking();
}

function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      updateUserPosition,
      handleLocationError,
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  } else {
    alert("Din webbläsare stödjer inte GPS.");
  }
}

function updateUserPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const heading = position.coords.heading || 0;

  currentPosition = [lat, lon];

  if (!userMarker) {
    userMarker = L.circleMarker(currentPosition, {
      radius: 8,
      color: "blue",
      fillColor: "#30f",
      fillOpacity: 0.7
    }).addTo(map);
  } else {
    userMarker.setLatLng(currentPosition);
  }

  if (!arrowMarker) {
    arrowMarker = L.marker(currentPosition, {
      icon: L.divIcon({
        className: "arrow-icon",
        html: "&#8594;",
        iconSize: [20, 20]
      })
    }).addTo(map);
  } else {
    arrowMarker.setLatLng(currentPosition);
    arrowMarker._icon.style.transform = `rotate(${heading}deg)`;
  }

  if (followUser) {
    map.setView(currentPosition, 16);
  }

  if (destination) {
    drawRoute(currentPosition, destination);
  }
}

function handleLocationError(err) {
  alert("Kunde inte hämta plats: " + err.message);
}

async function searchLocation() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  const results = await response.json();

  if (results.length > 0) {
    const lat = results[0].lat;
    const lon = results[0].lon;
    const label = results[0].display_name;
    showDestination(lat, lon, label);
  } else {
    alert("Ingen plats hittad.");
  }
}

function showDestination(lat, lon, label) {
  if (destinationMarker) destinationMarker.remove();

  destinationMarker = L.marker([lat, lon]).addTo(map);
  destinationMarker.bindPopup(`
    <div style="min-width:200px;">
      <p>${label}</p>
      <button onclick="startRoute(${lat},${lon})"
        style="margin-top:6px; padding:6px 12px; border:none; background:#007bff; color:white; border-radius:4px; cursor:pointer;">
        Start Route
      </button>
    </div>
  `).openPopup();
}

function startRoute(lat, lon) {
  if (!currentPosition) {
    alert("Din nuvarande position hittades inte än!");
    return;
  }
  destination = [lat, lon];
  drawRoute(currentPosition, destination);
}

async function drawRoute(start, end) {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
  );
  const data = await response.json();

  if (data.routes && data.routes.length > 0) {
    const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    if (routeLine) routeLine.remove();
    routeLine = L.polyline(coords, { color: "blue", weight: 5 }).addTo(map);
  }
}

window.onload = initMap;
