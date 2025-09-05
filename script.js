let map, userMarker, routeLine, ttsEnabled = true, autoRecenter = false;
let travelMode = "car";
let recentSearches = [];

window.onload = () => {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Default Sthlm
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // User position
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      const { latitude, longitude } = pos.coords;
      if (!userMarker) {
        userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Du är här");
      } else {
        userMarker.setLatLng([latitude, longitude]);
      }
      if (autoRecenter) map.setView([latitude, longitude], 15);
    }, () => alert("Kunde inte hämta position."));
  }

  document.getElementById("modeToggle").onclick = toggleMode;
  document.getElementById("ttsToggle").onclick = toggleTTS;
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

  // Trafikverket info (OBS: kräver API-nyckel från Trafikverket)
  fetchTrafficEvents();
};

function toggleMode() {
  document.body.classList.toggle("dark");
  document.getElementById("modeToggle").textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}
function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  document.getElementById("ttsToggle").textContent = ttsEnabled ? "🔊" : "🔇";
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
    startRoute(dest);
  } else {
    alert("Ingen plats hittad.");
  }
}

async function startRoute(destination) {
  if (!userMarker) return alert("Ingen startposition tillgänglig.");

  const start = userMarker.getLatLng();
  const res = await fetch(`https://router.project-osrm.org/route/v1/${travelMode}/${start.lng},${start.lat};${destination[1]},${destination[0]}?overview=full&geometries=geojson&steps=true`);
  const data = await res.json();

  if (data.routes.length > 0) {
    const route = data.routes[0];
    routeLine = L.geoJSON(route.geometry, { color: "blue" }).addTo(map);
    map.fitBounds(routeLine.getBounds());

    if (ttsEnabled && "speechSynthesis" in window) {
      let instructions = [];
      route.legs[0].steps.forEach(step => {
        if (step.maneuver.instruction) instructions.push(step.maneuver.instruction);
      });
      speakInstructions(instructions);
    }
  }
}

function speakInstructions(instructions) {
  instructions.forEach((text, i) => {
    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "sv-SE";
      window.speechSynthesis.speak(utter);
    }, i * 5000); // var 5 sek
  });
}

async function fetchTrafficEvents() {
  // Detta kräver Trafikverket API nyckel
  const apiKey = "1ea923daae314b80addd205c26007e35";
  const body = `
    <REQUEST>
      <LOGIN authenticationkey="${apiKey}" />
      <QUERY objecttype="Situation" schemaversion="1" limit="20">
        <FILTER><EQ name="Deviation.IconId" value="1"/></FILTER>
      </QUERY>
    </REQUEST>`;
  try {
    const res = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
      method: "POST", headers: { "Content-Type": "text/xml" }, body
    });
    const data = await res.json();
    if (data.RESPONSE?.RESULT[0]?.Situation) {
      data.RESPONSE.RESULT[0].Situation.forEach(s => {
        if (s.Deviation && s.Deviation[0].Geometry?.WGS84) {
          const coords = s.Deviation[0].Geometry.WGS84.match(/\(([^)]+)\)/)[1].split(" ");
          const lat = parseFloat(coords[1]), lon = parseFloat(coords[0]);
          L.marker([lat, lon]).addTo(map).bindPopup(s.Deviation[0].Header);
        }
      });
    }
  } catch (err) {
    console.error("Kunde inte hämta Trafikverket-data", err);
  }
}
