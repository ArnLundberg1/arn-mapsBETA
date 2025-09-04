let map, userMarker, destinationMarker, routeLine;
let followUser = true;
let currentPosition = null;
let destination = null;
let arrowMarker = null;

// Initialize map
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Default Stockholm

  // Base layer
  const lightTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
  }).addTo(map);

  // Dark mode
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

  // Search
  document.getElementById("searchBtn").addEventListener("click", searchLocation);
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchLocation();
  });

  // Locate
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (currentPosition) {
      map.setView(currentPosition, 16);
    }
  });

  // Follow button
  document.getElementById("followBtn").addEventListener("click", () => {
    followUser = !followUser;
  });

  // Start watching position
  startTracking();
}

// Track user location every 2s
function startTracking() {
  if (navigator.geolocation) {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(updateUserPosition);
    }, 2000);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Update user marker + arrow
function updateUserPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const accuracy = position.coords.accuracy;
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
      }),
      rotationAngle: heading
    }).addTo(map);
  } else {
    arrowMarker.setLatLng(currentPosition);
  }

  if (followUser) {
    map.setView(currentPosition, 16);
  }

  // Update route line if destination exists
  if (destination) {
    drawRoute(currentPosition, destination);
  }
}

// Search for destination
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
    alert("No results found");
  }
}

// Show destination popup with Start Route button
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

// Start routing from current position
function startRoute(lat, lon) {
  if (!currentPosition) {
    alert("Current position not found yet!");
    return;
  }

  destination = [lat, lon];
  drawRoute(currentPosition, destination);
}

// Draw blue line route
async function drawRoute(start, end) {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
  );
  const data = await response.json();

  if (data.routes && data.routes.length > 0) {
    const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);

    if (routeLine) routeLine.remove();

    routeLine = L.polyline(coords, { color: "blue", weight: 5 }).addTo(map);
    map.fitBounds(routeLine.getBounds());
  }
}

// Init map when page loads
window.onload = initMap;
