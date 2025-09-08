// Initiera kartan
const map = L.map('map').setView([59.3293, 18.0686], 12);

// Tiles
const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
let darkMode = false;

// Toggle dark mode
document.getElementById("modeToggle").addEventListener("click", () => {
  if (darkMode) {
    map.removeLayer(darkTiles);
    lightTiles.addTo(map);
    document.body.classList.remove("dark");
  } else {
    map.removeLayer(lightTiles);
    darkTiles.addTo(map);
    document.body.classList.add("dark");
  }
  darkMode = !darkMode;
});

// Position tracking
let userMarker = null;
let autoRecenter = true;
function updatePosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      if (!userMarker) {
        userMarker = L.marker([lat, lon]).addTo(map).bindPopup("Du är här");
      } else {
        userMarker.setLatLng([lat, lon]);
      }
      if (autoRecenter) map.setView([lat, lon], 15);
    });
  }
}
setInterval(updatePosition, 2000);
document.getElementById("recenterBtn").addEventListener("click", () => {
  autoRecenter = !autoRecenter;
  document.getElementById("recenterBtn").innerText = autoRecenter ? "Recenter ✅" : "Recenter ❌";
});

// Routing
let routeControl = null;
function startRoute(destination) {
  if (routeControl) map.removeControl(routeControl);
  updatePosition();
  if (userMarker) {
    const start = userMarker.getLatLng();
    routeControl = L.Routing.control({
      waypoints: [start, destination],
      routeWhileDragging: false,
      lineOptions: { styles: [{ color: 'blue', weight: 5 }] }
    }).addTo(map);
  }
}

// Klick på kartan för ny destination
map.on("click", e => {
  const marker = L.marker(e.latlng).addTo(map);
  marker.bindPopup(`<b>Destination</b><br><button onclick="startRoute([${e.latlng.lat},${e.latlng.lng}])">Start Route</button>`).openPopup();
});

// Sökning + autocomplete
const searchBox = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");
let recentSearches = [];

searchBox.addEventListener("input", async () => {
  const query = searchBox.value;
  suggestions.innerHTML = "";
  if (query.length < 3) return;

  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
  const results = await res.json();

  results.forEach(r => {
    const div = document.createElement("div");
    div.textContent = r.display_name;
    div.onclick = () => {
      const dest = [r.lat, r.lon];
      startRoute(dest);
      searchBox.value = r.display_name;
      recentSearches.unshift(r.display_name);
      if (recentSearches.length > 5) recentSearches.pop();
      showRecentSearches();
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(div);
  });
});

function showRecentSearches() {
  suggestions.innerHTML = "<strong>Senaste sökningar:</strong>";
  recentSearches.forEach(s => {
    const div = document.createElement("div");
    div.textContent = s;
    div.onclick = () => { searchBox.value = s; };
    suggestions.appendChild(div);
  });
}

// Färdsätt popup
const travelPopup = document.getElementById("travelPopup");
document.getElementById("travelModeBtn").addEventListener("click", () => {
  travelPopup.classList.remove("hidden");
});
document.getElementById("closeTravel").addEventListener("click", () => {
  travelPopup.classList.add("hidden");
});
document.querySelectorAll(".mode-option").forEach(btn => {
  btn.addEventListener("click", () => {
    alert(`Färdsätt valt: ${btn.dataset.mode}`);
    travelPopup.classList.add("hidden");
  });
});

// Trafikverket API
const TRAFIKVERKET_API_KEY = "1ea923daae314b80addd205c26007e35"; // byt ut mot egen
let trafficMarkers = {};

async function loadTrafficInfo() {
  const query = `
  <REQUEST>
    <LOGIN authenticationkey="${TRAFIKVERKET_API_KEY}" />
    <QUERY objecttype="Situation" schemaversion="1">
      <FILTER></FILTER>
      <INCLUDE>Deviation.Id</INCLUDE>
      <INCLUDE>Deviation.Message</INCLUDE>
      <INCLUDE>Deviation.IconId</INCLUDE>
      <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
    </QUERY>
  </REQUEST>`;
  try {
    const res = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/xml" }
    });
    const data = await res.json();
    const activeIds = new Set();

    if (data?.RESPONSE?.RESULT?.[0]?.Situation) {
      data.RESPONSE.RESULT[0].Situation.forEach(sit => {
        if (sit.Deviation) {
          sit.Deviation.forEach(dev => {
            if (dev.Id && dev.Geometry?.WGS84) {
              activeIds.add(dev.Id);
              if (trafficMarkers[dev.Id]) return;

              const coords = dev.Geometry.WGS84.replace("POINT (", "").replace(")", "").split(" ");
              const lon = parseFloat(coords[0]);
              const lat = parseFloat(coords[1]);

              let iconUrl = "https://cdn-icons-png.flaticon.com/512/564/564619.png";
              if (dev.IconId === "1") iconUrl = "https://cdn-icons-png.flaticon.com/512/564/564619.png";
              if (dev.IconId === "2") iconUrl = "https://cdn-icons-png.flaticon.com/512/2991/2991115.png";

              const customIcon = L.icon({ iconUrl, iconSize: [24, 24] });
              const marker = L.marker([lat, lon], { icon: customIcon })
                .addTo(map).bindPopup(dev.Message || "Ingen beskrivning");
              trafficMarkers[dev.Id] = marker;
            }
          });
        }
      });
    }
    Object.keys(trafficMarkers).forEach(id => {
      if (!activeIds.has(id)) {
        map.removeLayer(trafficMarkers[id]);
        delete trafficMarkers[id];
      }
    });
  } catch (err) { console.error("Fel vid hämtning av trafikdata:", err); }
}
loadTrafficInfo();
setInterval(loadTrafficInfo, 20000);
