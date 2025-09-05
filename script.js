let map;
let userMarker;
let routeLine;
let ttsEnabled = true;
let travelMode = "car";
let synth = window.speechSynthesis;

// Init map
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  userMarker = L.marker([59.3293, 18.0686]).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateUserPos, console.error, { enableHighAccuracy: true });
  }

  document.getElementById("modeToggle").addEventListener("click", toggleMode);
  document.getElementById("ttsToggle").addEventListener("click", toggleTTS);
  document.getElementById("recenterBtn").addEventListener("click", recenterMap);
  document.getElementById("travelModeBtn").addEventListener("click", () => {
    document.getElementById("travelModePopup").classList.remove("hidden");
  });
  document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("travelModePopup").classList.add("hidden");
  });

  document.querySelectorAll("#travelModePopup button[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      travelMode = btn.dataset.mode;
      speak(`Färdsätt ändrat till ${travelMode}`);
      document.getElementById("travelModePopup").classList.add("hidden");
    });
  });

  setupSearch();
}

// Update user position
function updateUserPos(pos) {
  const { latitude, longitude } = pos.coords;
  userMarker.setLatLng([latitude, longitude]);
}

// Recenter map
function recenterMap() {
  if (userMarker) {
    map.setView(userMarker.getLatLng(), 15);
  }
}

// Toggle Dark/Light
function toggleMode() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

// Toggle TTS
function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  document.getElementById("ttsToggle").innerText = ttsEnabled ? "🔊" : "🔇";
}

// Speak TTS
function speak(text) {
  if (ttsEnabled && synth) {
    let utter = new SpeechSynthesisUtterance(text);
    utter.lang = "sv-SE";
    synth.speak(utter);
  }
}

// Search bar + route
function setupSearch() {
  const searchBox = document.getElementById("searchBox");

  searchBox.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = searchBox.value;
      if (!query) return;

      const coords = await geocode(query);
      if (coords) {
        startRoute(userMarker.getLatLng(), coords, query);
      }
    }
  });
}

// Start route with OSRM + TTS directions
async function startRoute(start, end, name) {
  if (routeLine) map.removeLayer(routeLine);

  const url = `https://router.project-osrm.org/route/v1/${travelMode}/${start.lng},${start.lat};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      routeLine = L.geoJSON(route.geometry, { color: "blue" }).addTo(map);
      map.fitBounds(routeLine.getBounds());

      speak(`Rutt startad till ${name}`);

      // Läs upp varje steg en gång
      route.legs[0].steps.forEach((step, index) => {
        setTimeout(() => {
          speak(step.maneuver.instruction);
        }, index * 4000);
      });
    } else {
      speak("Ingen rutt hittades");
    }
  } catch (err) {
    console.error("Fel vid hämtning av rutt", err);
    speak("Kunde inte hämta rutt");
  }
}

// Geocode via Nominatim
async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}

window.onload = initMap;
