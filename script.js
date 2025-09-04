let map, routingControl;
let darkMode = false;
let userMarker = null;
let userCircle = null;
let userPos = null;
let destination = null;
let routeUpdater = null;

// Custom arrow icon for user
function createArrowIcon(rotation) {
  return L.divIcon({
    html: `<div style="transform: rotate(${rotation}deg);">
             <img src="https://img.icons8.com/fluency/48/arrow.png" style="width:32px; height:32px;">
           </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

// Init map
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13);

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

  // Locate button
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (userPos) {
      map.setView([userPos.lat, userPos.lng], 16);
    }
  });

  // Routing (hidden UI)
  routingControl = L.Routing.control({
    waypoints: [],
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null,
    lineOptions: {
      styles: [{ color: "blue", weight: 5 }]
    }
  }).addTo(map);

  // Search destination
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const place = data[0];
          showDestination(place.lat, place.lon, place.display_name);
        }
      });
  });

  // Click to set destination
  map.on("click", e => {
    showDestination(e.latlng.lat, e.latlng.lng, "Custom Point");
  });

  startTracking();
}

// Show destination with popup
function showDestination(lat, lon, label) {
  if (destination) destination.remove();

  destination = L.marker([lat, lon]).addTo(map);
  destination.bindPopup(`<b>${label}</b><br><button onclick="startRoute(${lat},${lon})">Start Route</button>`).openPopup();
}

// Start routing
function startRoute(lat, lon) {
  if (routeUpdater) clearInterval(routeUpdater);

  routeUpdater = setInterval(() => {
    if (userPos) {
      routingControl.setWaypoints([
        L.latLng(userPos.lat, userPos.lng),
        L.latLng(lat, lon)
      ]);
    }
  }, 2000);

  // Initial route
  if (userPos) {
    routingControl.setWaypoints([
      L.latLng(userPos.lat, userPos.lng),
      L.latLng(lat, lon)
    ]);
  }
}

// Track user
function startTracking() {
  if (!navigator.geolocation) return alert("Geolocation not supported");

  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const heading = pos.coords.heading || 0;
    userPos = { lat, lng: lon };

    if (userMarker) {
      userMarker.setLatLng([lat, lon]);
      userMarker.setIcon(createArrowIcon(heading));
      userCircle.setLatLng([lat, lon]);
      userCircle.setRadius(pos.coords.accuracy);
    } else {
      userMarker = L.marker([lat, lon], { icon: createArrowIcon(heading) }).addTo(map);
      userCircle = L.circle([lat, lon], { radius: pos.coords.accuracy }).addTo(map);
    }

    // Always follow user
    map.setView([lat, lon], 16);
  }, err => console.error(err), { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
}

initMap();
