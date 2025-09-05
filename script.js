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
  fetchTrafficIncidents();
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
  const suggestions = document.getElementById("suggestions");
  let history = [];

  searchBox.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = searchBox.value;
      if (!query) return;
      history.unshift(query);
      if (history.length > 5) history.pop();

      updateSuggestions(history);

      const coords = await geocode(query);
      if (coords) {
        startRoute(userMarker.getLatLng(), coords, query);
      }
    }
  });

  function updateSuggestions(history) {
    suggestions.innerHTML = "";
    history.forEach(item => {
      const div = document.createElement("div");
      div.innerText = item;
      div.onclick = async () => {
        searchBox.value = item;
        const coords = await geocode(item);
        if (coords) {
          startRoute(userMarker.getLatLng(), coords, item);
        }
      };
      suggestions.appendChild(div);
    });
  }
}

// Start route with OSRM + TTS directions
async function startRoute(start, end, name) {
  if (routeLine) map.removeLayer(routeLine);

  const url = `https://router.project-osrm.org/route/v1/${travelMode}/${start.lng},${start.lat};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.routes && data.routes.length > 0) {
    const route = data.routes[0];
    routeLine = L.geoJSON(route.geometry, { color: "blue" }).addTo(map);
    map.fitBounds(routeLine.getBounds());

    speak(`Rutt startad till ${name}`);

    // Speak each step
    route.legs[0].steps.forEach((step, index) => {
      setTimeout(() => {
        speak(step.maneuver.instruction);
      }, index * 5000); // läs upp varje steg med paus
    });
  } else {
    speak("Ingen rutt hittades");
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

// Trafikverket incidents
async function fetchTrafficIncidents() {
  const apiKey = "DIN_TRAFIKEVERKET_API_KEY"; // <-- byt ut
  const query = `
  <REQUEST>
    <LOGIN authenticationkey="${apiKey}" />
    <QUERY objecttype="Situation" schemaversion="1"></QUERY>
  </REQUEST>`;

  try {
    const response = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: query,
    });

    const data = await response.json();
    if (data.RESPONSE && data.RESPONSE.RESULT) {
      const situations = data.RESPONSE.RESULT[0].Situation || [];
      situations.forEach(s => {
        const lat = s?.SituationExtension?.Location?.Point?.Coordinate?.Latitude;
        const lon = s?.SituationExtension?.Location?.Point?.Coordinate?.Longitude;
        const desc = s?.Description?.[0]?.Value || "Händelse";

        if (lat && lon) {
          L.marker([lat, lon], { title: desc })
            .bindPopup(`<b>Trafikinfo:</b><br>${desc}`)
            .addTo(map);
        }
      });
    }
  } catch (err) {
    console.error("Kunde inte hämta Trafikverket-data", err);
  }
}

window.onload = initMap;
