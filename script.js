let map, userMarker, routeLine, autoRecenter = false;
let travelMode = "car";
let recentSearches = [];

window.onload = () => {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Default Sthlm
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // User position (uppdatera var 2s)
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      const { latitude, longitude } = pos.coords;
      if (!userMarker) {
        userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Du är här");
      } else {
        userMarker.setLatLng([latitude, longitude]);
      }
      if (autoRecenter) map.setView([latitude, longitude], 15);
    }, () => alert("Kunde inte hämta position."), { enableHighAccuracy:true, maximumAge:0, timeout:5000 });
  }

  document.getElementById("modeToggle").onclick = toggleMode;
  document.getElementById("recenterBtn").onclick = () => autoRecenter = !autoRecenter;

  // Travel mode popup
  const popup = document.getElementById("travelModePopup");
  document.getElementById("travelModeBtn").onclick = () => popup.classList.remove("hidden");
  document.getElementById("closePopup").onclick = () => popup.classList.add("hidden");
  popup.querySelectorAll("button[data-mode]").forEach(btn => {
    btn.onclick = () => { travelMode = btn.dataset.mode; popup.classList.add("hidden"); };
  });

  // Search
  document.getElementById("searchBox").addEventListener("keypress", e => {
    if (e.key === "Enter") searchDestination(e.target.value);
  });
};

function toggleMode() {
  document.body.classList.toggle("dark");
  document.getElementById("modeToggle").textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

async function searchDestination(query) {
  if (!query) return;
  recentSearches.unshift(query);
  if (recentSearches.length > 5) recentSearches.pop();

  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (data.length > 0) {
    const dest = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    if (routeLine) map.removeLayer(routeLine);

    // Placera en marker med popup och "Start Route"-knapp
    const marker = L.marker(dest).addTo(map).bindPopup(`
      <b>${data[0].display_name}</b><br>
      <button onclick="startRoute([${dest[0]},${dest[1]}])">Start Route</button>
    `);
    marker.openPopup();
  } else {
    alert("Ingen plats hittad.");
  }
}

async function startRoute(destination) {
  if (!userMarker) return alert("Ingen startposition tillgänglig.");

  const start = userMarker.getLatLng();
  const res = await fetch(`https://router.project-osrm.org/route/v1/${travelMode}/${start.lng},${start.lat};${destination[1]},${destination[0]}?overview=full&geometries=geojson`);
  const data = await res.json();

  if (data.routes.length > 0) {
    const route = data.routes[0];
    routeLine = L.geoJSON(route.geometry, { color: "blue" }).addTo(map);
    map.fitBounds(routeLine.getBounds());
  }
}
