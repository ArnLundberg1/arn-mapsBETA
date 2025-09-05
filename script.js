// Initiera kartan
const map = L.map('map').setView([59.3293, 18.0686], 12); // Stockholm default

// Light/Dark tiles
const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © Carto'
});

let darkMode = false;

// Toggle mellan Light/Dark mode
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

// Position marker
let userMarker = null;
let autoRecenter = true;

function updatePosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      if (!userMarker) {
        userMarker = L.marker([lat, lon], { title: "Du är här" }).addTo(map);
      } else {
        userMarker.setLatLng([lat, lon]);
      }

      if (autoRecenter) {
        map.setView([lat, lon], 15);
      }
    });
  }
}

// Uppdatera var 2 sekunder
setInterval(updatePosition, 2000);

// Toggle recenter
document.getElementById("recenterBtn").addEventListener("click", () => {
  autoRecenter = !autoRecenter;
  document.getElementById("recenterBtn").innerText = autoRecenter ? "Recenter ✅" : "Recenter ❌";
});

// Trafikverket API
const TRAFIKVERKET_API_KEY = "DIN_API_NYCKEL_HÄR"; // byt ut mot egen nyckel
let trafficMarkers = {}; // lagrar markörer med ID som nyckel

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

    // Samla alla aktiva ID från Trafikverket
    const activeIds = new Set();

    if (data?.RESPONSE?.RESULT?.[0]?.Situation) {
      data.RESPONSE.RESULT[0].Situation.forEach(sit => {
        if (sit.Deviation) {
          sit.Deviation.forEach(dev => {
            if (dev.Id && dev.Geometry?.WGS84) {
              activeIds.add(dev.Id);

              // Om markör redan finns → hoppa över
              if (trafficMarkers[dev.Id]) return;

              // Koordinater
              const coords = dev.Geometry.WGS84
                .replace("POINT (", "")
                .replace(")", "")
                .split(" ");
              const lon = parseFloat(coords[0]);
              const lat = parseFloat(coords[1]);

              // Ikoner
              let iconUrl = "https://cdn-icons-png.flaticon.com/512/565/565547.png"; // default händelse
              if (dev.IconId === "1") iconUrl = "https://cdn-icons-png.flaticon.com/512/564/564619.png"; // olycka
              if (dev.IconId === "2") iconUrl = "https://cdn-icons-png.flaticon.com/512/2991/2991115.png"; // vägarbete

              const customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [24, 24]
              });

              // Lägg till markör
              const marker = L.marker([lat, lon], { icon: customIcon })
                .addTo(map)
                .bindPopup(dev.Message || "Ingen beskrivning");

              trafficMarkers[dev.Id] = marker;
            }
          });
        }
      });
    }

    // Ta bort markörer som inte längre finns i Trafikverkets svar
    Object.keys(trafficMarkers).forEach(id => {
      if (!activeIds.has(id)) {
        map.removeLayer(trafficMarkers[id]);
        delete trafficMarkers[id];
      }
    });

  } catch (err) {
    console.error("Fel vid hämtning av trafikdata:", err);
  }
}

// Hämta trafikinfo vid start
loadTrafficInfo();

// 🔄 Uppdatera trafikdata var 20:e sekund
setInterval(loadTrafficInfo, 20000);
