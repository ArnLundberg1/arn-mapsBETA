let map, userMarker, routeLine, autoRecenter = false;
let travelMode = "car";
const ORS_API_KEY = ""; // ej nödvändigt nu, vi kör OSRM
const TRAFIKVERKET_API_KEY = "DIN_TRAFIKEVERKET_API_KEY";

window.onload = () => {
  map = L.map("map").setView([59.3293, 18.0686], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // Hämta trafikinfo
  fetchTrafficEvents();

  // User position
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      const lat = pos.coords.latitude, lon = pos.coords.longitude;
      if (!userMarker) {
        userMarker = L.marker([lat, lon]).addTo(map).bindPopup("Du är här");
      } else {
        userMarker.setLatLng([lat, lon]);
      }
      if (autoRecenter) map.setView([lat, lon], 15);
    }, () => alert("Kunde inte hämta position."), {
      enableHighAccuracy: true, maximumAge: 0, timeout: 5000
    });
  }

  document.getElementById("modeToggle").onclick = toggleMode;
  document.getElementById("recenterBtn").onclick = () => {
    autoRecenter = !autoRecenter;
    document.getElementById("recenterBtn").style.background = autoRecenter ? "#007bff" : "white";
  };

  // Travel mode popup logic
  const popup = document.getElementById("travelModePopup");
  document.getElementById("travelModeBtn").onclick = () => popup.classList.remove("hidden");
  document.getElementById("closePopup").onclick = () => popup.classList.add("hidden");
  popup.querySelectorAll("button[data-mode]").forEach(btn => {
    btn.onclick = () => {
      travelMode = btn.dataset.mode;
      alert("Färdsätt ändrat till: " + travelMode);
      popup.classList.add("hidden");
    };
  });

  // Search logic
  document.getElementById("searchBox").addEventListener("keypress", e => {
    if (e.key === "Enter") searchDestination(e.target.value);
  });
};

async function searchDestination(query) {
  if (!query) return;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!data.length) return alert("Ingen plats hittad.");

  const lat = parseFloat(data[0].lat), lon = parseFloat(data[0].lon);
  if (routeLine) map.removeLayer(routeLine);

  const marker = L.marker([lat, lon]).addTo(map).bindPopup(`
    <b>${data[0].display_name}</b><br>
    <button onclick="startRoute([${lat},${lon}])">Start Route</button>
  `);
  marker.openPopup();
}

async function startRoute(dest) {
  if (!userMarker) return alert("Ingen startposition tillgänglig.");

  const start = userMarker.getLatLng();
  const url = `https://router.project-osrm.org/route/v1/${travelMode}/${start.lng},${start.lat};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes || !data.routes.length) return alert("Ingen rutt hittad.");

  routeLine = L.geoJSON(data.routes[0].geometry, { color: "blue" }).addTo(map);
  map.fitBounds(routeLine.getBounds());
}

// Trafikverket – visa händelsemarkörer
async function fetchTrafficEvents() {
  if (!TRAFIKVERKET_API_KEY) return;

  const xml = `
    <REQUEST>
      <LOGIN authenticationkey="${TRAFIKVERKET_API_KEY}" />
      <QUERY objecttype="Situation" schemaversion="1"></QUERY>
    </REQUEST>`;

  try {
    const resp = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xml
    });
    const data = await resp.json();
    const situations = data?.RESPONSE?.RESULT[0]?.Situation || [];
    situations.forEach(s => {
      const coord = s?.SituationExtension?.Location?.Point?.Coordinate;
      const lat = coord?.Latitude, lon = coord?.Longitude;
      const desc = s?.Description?.[0]?.Value;
      if (lat && lon) {
        L.marker([lat, lon]).addTo(map).bindPopup(`<b>Händelse:</b><br>${desc}`);
      }
    });
  } catch (err) {
    console.warn("Trafikverket-data misslyckades:", err);
  }
}
