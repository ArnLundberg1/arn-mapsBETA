let map, userMarker, userArrow, recenter = true;
let trafficLayer = L.layerGroup();
let directions = [];
let lastSteps = [];
let ttsEnabled = true;

// Initiera kartan
map = L.map('map').setView([59.3293, 18.0686], 13); // Default Sthlm
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
trafficLayer.addTo(map);

// Toggle Light/Dark mode
document.getElementById("mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// Recenter toggle
document.getElementById("recenter").addEventListener("click", () => {
  recenter = !recenter;
  alert("Recenter " + (recenter ? "på" : "av"));
});

// TTS toggle
document.getElementById("tts-toggle").addEventListener("click", () => {
  ttsEnabled = !ttsEnabled;
  alert("TTS " + (ttsEnabled ? "aktiverad" : "avaktiverad"));
});

// Uppdatera användarposition
function updateUserPosition() {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const latlng = [latitude, longitude];

    if (!userMarker) {
      userMarker = L.marker(latlng).addTo(map);
    } else {
      userMarker.setLatLng(latlng);
    }

    if (!userArrow) {
      userArrow = L.circleMarker(latlng, {
        radius: 6, color: "blue"
      }).addTo(map);
    } else {
      userArrow.setLatLng(latlng);
    }

    if (recenter) {
      map.setView(latlng, 15);
    }
  });
}
setInterval(updateUserPosition, 2000);
updateUserPosition();

// =====================
// Vägbeskrivningar + TTS
// =====================
function showDirections(steps) {
  directions = steps;
  updateDirectionsBox(true); // Force update vid ny rutt
}

function updateDirectionsBox(force = false) {
  const box = document.getElementById("directions-box");
  if (!box) return;

  const upcoming = directions.slice(0, 2); // Visa bara 2 steg

  if (!force && JSON.stringify(upcoming) === JSON.stringify(lastSteps)) {
    return; // inga ändringar
  }
  lastSteps = [...upcoming];

  box.innerHTML = "";
  upcoming.forEach(step => {
    const div = document.createElement("div");
    div.textContent = step;
    box.appendChild(div);
  });

  if (ttsEnabled && upcoming.length > 0) {
    const msg = new SpeechSynthesisUtterance(upcoming[0]);
    msg.lang = "sv-SE";
    window.speechSynthesis.speak(msg);
  }
}

// Uppdatera directions varje 2 sek
setInterval(() => updateDirectionsBox(false), 2000);

// =====================
// Trafikverket API
// =====================
function parseWKT(wkt) {
  const match = wkt.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (match) return [parseFloat(match[2]), parseFloat(match[1])];
  return null;
}

async function fetchTrafficData() {
  const query = `
  <REQUEST>
    <LOGIN authenticationkey="1ea923daae314b80addd205c26007e35" />
    <QUERY objecttype="Situation" schemaversion="1">
      <FILTER />
    </QUERY>
  </REQUEST>`;

  const res = await fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: query
  });
  const data = await res.json();
  return data.RESPONSE.RESULT[0].Situation;
}

async function updateTrafficMarkers() {
  const situations = await fetchTrafficData();
  trafficLayer.clearLayers();

  situations.forEach(sit => {
    if (!sit?.Location?.Geometry?.WGS84) return;
    const latlon = parseWKT(sit.Location.Geometry.WGS84);

    let iconUrl = "icons/event.png";
    let title = "Händelse";

    if (sit.SituationType?.includes("Accident")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/1698/1698535.png";
      title = "Olycka";
    }
    if (sit.SituationType?.includes("RoadWork")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/1029/1029183.png";
      title = "Vägarbete";
    }
    if (sit.SituationType?.includes("QueueingTraffic")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/3202/3202926.png";
      title = "Köbildning";
    }
    if (sit.SituationType?.includes("WeatherWarning")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
      title = "Vädervarning";
    }

    const marker = L.marker(latlon, {
      icon: L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    });

    marker.bindPopup(`
      <b>${title}</b><br>
      ${sit.Message?.[0]?.Description?.[0]?.Value || "Ingen beskrivning"}
    `);

    trafficLayer.addLayer(marker);
  });
}
setInterval(updateTrafficMarkers, 20000);
updateTrafficMarkers();
