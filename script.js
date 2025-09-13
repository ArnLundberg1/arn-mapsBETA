let map, userMarker, userCircle;
let recenter = true;
let trafficLayer = L.layerGroup();

// Initiera karta
map = L.map('map').setView([59.3293, 18.0686], 13); // Stockholm default
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
trafficLayer.addTo(map);

// Uppdatera användarens position
function updateUserPosition() {
  if (!navigator.geolocation) {
    alert("Geolocation stöds inte i din webbläsare.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const latlng = [latitude, longitude];

    if (!userMarker) {
      userMarker = L.marker(latlng).addTo(map);
      userCircle = L.circle(latlng, { radius: 20, color: "blue", fillOpacity: 0.3 }).addTo(map);
    } else {
      userMarker.setLatLng(latlng);
      userCircle.setLatLng(latlng);
    }

    if (recenter) {
      map.setView(latlng, 15);
    }
  }, err => {
    console.error("Fel vid geolocation:", err);
  });
}
setInterval(updateUserPosition, 2000);
updateUserPosition();

// Recenter-knapp
document.getElementById('recenter').addEventListener('click', () => {
  recenter = !recenter;
  alert("Recenter är nu " + (recenter ? "på" : "av"));
});

// Dark/Light Mode toggle
document.getElementById('mode-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// === Trafikverket data ===
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
  try {
    const situations = await fetchTrafficData();
    trafficLayer.clearLayers();

    situations.forEach(sit => {
      if (!sit?.Location?.Geometry?.WGS84) return;
      const latlon = parseWKT(sit.Location.Geometry.WGS84);

      let iconUrl = "https://cdn-icons-png.flaticon.com/512/565/565547.png";
      let title = "Händelse";

      if (sit.SituationType?.includes("Accident")) {
        iconUrl = "https://cdn-icons-png.flaticon.com/512/1698/1698535.png";
        title = "Olycka";
      } else if (sit.SituationType?.includes("RoadWork")) {
        iconUrl = "https://cdn-icons-png.flaticon.com/512/1029/1029183.png";
        title = "Vägarbete";
      }

      const marker = L.marker(latlon, {
        icon: L.icon({
          iconUrl,
          iconSize: [28, 28],
          iconAnchor: [14, 28]
        })
      });

      marker.bindPopup(`
        <b>${title}</b><br>
        ${sit.Message?.[0]?.Description?.[0]?.Value || "Ingen beskrivning"}
      `);

      trafficLayer.addLayer(marker);
    });
  } catch (err) {
    console.error("Fel vid hämtning av trafikdata:", err);
  }
}

setInterval(updateTrafficMarkers, 20000);
updateTrafficMarkers();
