let map;
let userMarker;
let userPosition;
let destinationMarker;
let routingControl;
let followUser = true;

// Initiera kartan
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Default Stockholm

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Klick på kartan för att välja destination
  map.on("click", async (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const label = await getAddress(lat, lon);
    showDestination(lat, lon, label);
  });

  requestLocationPermission();
}

// Hämta användarens plats
function requestLocationPermission() {
  document.getElementById("locationPopup").style.display = "none";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      updateUserPosition,
      handleLocationError,
      { enableHighAccuracy: true }
    );

    // Uppdatera varannan sekund
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        updateUserPosition,
        handleLocationError,
        { enableHighAccuracy: true }
      );
    }, 2000);
  } else {
    alert("Din webbläsare stödjer inte platsinformation.");
  }
}

// Uppdatera användarens position på kartan
function updateUserPosition(position) {
  userPosition = [position.coords.latitude, position.coords.longitude];

  if (!userMarker) {
    const arrowIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    userMarker = L.marker(userPosition, { icon: arrowIcon }).addTo(map);
    map.setView(userPosition, 15);
  } else {
    userMarker.setLatLng(userPosition);
  }

  if (followUser) {
    map.setView(userPosition, map.getZoom());
  }
}

// Hantera platsfel
function handleLocationError(err) {
  console.warn("GPS error:", err.message);
  document.getElementById("locationPopup").style.display = "flex";
}

// Hämta adress via Nominatim
async function getAddress(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch (e) {
    return "Unknown location";
  }
}

// Visa destination + startknapp
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

// Starta en rutt från användarens position
function startRoute(destLat, destLon) {
  if (!userPosition) {
    alert("Din position är inte tillgänglig ännu.");
    return;
  }

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userPosition[0], userPosition[1]),
      L.latLng(destLat, destLon)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null
  }).addTo(map);
}

window.onload = initMap;
