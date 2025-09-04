let map, userMarker, userPosition, destinationMarker, routingControl;
let followUser = false;
let darkMode = false;
let recentSearches = [];
let travelMode = "car"; // default bil

// OpenRouteService API key (valfri, för cykel/gång/bil)
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE4ZWM0ZDZmNWZkNjQzZThiYzcwOTI0NjlmOWRmYmFhIiwiaCI6Im11cm11cjY0In0="; 

function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13);

  // Light mode tiles default
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Klick för att välja destination
  map.on("click", async (e) => {
    const lat = e.latlng.lat, lon = e.latlng.lng;
    const label = await getAddress(lat, lon);
    showDestination(lat, lon, label);
  });

  // Sök
  document.getElementById("searchBox").addEventListener("input", handleSearch);

  requestLocationPermission();
  loadRecentSearches();
}

// --- Hantering av platsinfo ---
function requestLocationPermission() {
  if (!navigator.geolocation) {
    alert("Din webbläsare stöder inte platsinformation.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userPosition = [pos.coords.latitude, pos.coords.longitude];
      updateUserMarker();
      watchUserPosition();
    },
    () => {
      document.getElementById("locationPopup").style.display = "flex";
    }
  );
}

// Om användaren trycker OK i popup
function requestLocationPermissionAgain() {
  document.getElementById("locationPopup").style.display = "none";
  requestLocationPermission();
}

// Följ användaren
function watchUserPosition() {
  navigator.geolocation.watchPosition((pos) => {
    userPosition = [pos.coords.latitude, pos.coords.longitude];
    updateUserMarker();
    if (followUser) map.setView(userPosition, 15);
  });
}

// Visa användaren
function updateUserMarker() {
  if (userMarker) userMarker.setLatLng(userPosition);
  else {
    userMarker = L.marker(userPosition, { icon: blueArrowIcon() }).addTo(map);
    map.setView(userPosition, 15);
  }
}

// Blå pil för användaren
function blueArrowIcon() {
  return L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
}

// --- Destination ---
function showDestination(lat, lon, label) {
  if (destinationMarker) destinationMarker.remove();
  if (routingControl) map.removeControl(routingControl);

  destinationMarker = L.marker([lat, lon]).addTo(map);
  destinationMarker.bindPopup(`
    <div>
      <p>${label}</p>
      <button onclick="startRoute(${lat},${lon})">Start Route</button>
    </div>
  `).openPopup();

  saveRecentSearch(label, lat, lon);
}

// Starta rutt
async function startRoute(destLat, destLon) {
  if (!userPosition) return alert("Din position är inte tillgänglig ännu.");
  if (routingControl) map.removeControl(routingControl);

  if (travelMode === "car" || travelMode === "bike" || travelMode === "foot") {
    try {
      const res = await fetch(`https://api.openrouteservice.org/v2/directions/${travelMode}?api_key=${ORS_API_KEY}&start=${userPosition[1]},${userPosition[0]}&end=${destLon},${destLat}`);
      const data = await res.json();

      const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
      routingControl = L.polyline(coords, { color: "blue", weight: 5 }).addTo(map);
      map.fitBounds(routingControl.getBounds());
    } catch (err) {
      console.error("ORS error:", err);
      fallbackRoute(destLat, destLon);
    }
  } else if (travelMode === "bus") {
    if (isInStockholm(userPosition)) {
      alert("Hämtar tidtabell från SL... (kräver API-nyckel)");
    } else if (isInGothenburg(userPosition)) {
      alert("Hämtar tidtabell från Västtrafik... (kräver API-nyckel)");
    } else {
      alert("Buss endast tillgänglig i Stockholm & Göteborg.");
    }
  }
}

// Fallback Leaflet bilväg
function fallbackRoute(destLat, destLon) {
  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userPosition[0], userPosition[1]),
      L.latLng(destLat, destLon)
    ],
    createMarker: () => null
  }).addTo(map);
}

// --- Geocoding ---
async function getAddress(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    return data.display_name || "Okänd plats";
  } catch {
    return "Okänd plats";
  }
}

// --- Sökning ---
async function handleSearch(e) {
  const query = e.target.value;
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";

  if (query.length < 3) return;

  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`);
  const results = await res.json();

  results.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.display_name;
    li.onclick = () => {
      showDestination(r.lat, r.lon, r.display_name);
      suggestionsList.innerHTML = "";
    };
    suggestionsList.appendChild(li);
  });
}

// --- Historik ---
function saveRecentSearch(label, lat, lon) {
  const now = new Date().toLocaleString();
  recentSearches.unshift({ label, lat, lon, time: now });
  if (recentSearches.length > 5) recentSearches.pop();
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  showRecentSearches();
}

function loadRecentSearches() {
  const saved = localStorage.getItem("recentSearches");
  if (saved) recentSearches = JSON.parse(saved);
  showRecentSearches();
}

function showRecentSearches() {
  const list = document.getElementById("recentSearches");
  list.innerHTML = "";
  recentSearches.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.label} (${item.time})`;
    li.onclick = () => showDestination(item.lat, item.lon, item.label);
    list.appendChild(li);
  });
  list.style.display = recentSearches.length ? "block" : "none";
}

// --- Recenter ---
function toggleRecenter() {
  followUser = !followUser;
  document.getElementById("recenterBtn").textContent =
    followUser ? "📍 Recenter: ON" : "📍 Recenter: OFF";
}

// --- Dark/Light mode ---
function toggleMode() {
  darkMode = !darkMode;
  if (darkMode) {
    map.eachLayer(l => map.removeLayer(l));
    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png").addTo(map);
    document.getElementById("modeBtn").textContent = "☀️ Light Mode";
  } else {
    map.eachLayer(l => map.removeLayer(l));
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    document.getElementById("modeBtn").textContent = "🌙 Dark Mode";
  }
}

// --- Färdsätt ---
function openModePopup() { document.getElementById("modePopup").style.display = "flex"; }
function closeModePopup() { document.getElementById("modePopup").style.display = "none"; }
function setTravelMode(mode) {
  travelMode = mode;
  alert("Färdsätt ändrat till: " + mode);
  closeModePopup();
}

// --- Bussområden ---
function isInStockholm(pos) {
  return pos[0] > 59 && pos[0] < 60 && pos[1] > 17 && pos[1] < 19;
}
function isInGothenburg(pos) {
  return pos[0] > 57 && pos[0] < 58 && pos[1] > 11 && pos[1] < 13;
}

// Initiera kartan
window.onload = initMap;
