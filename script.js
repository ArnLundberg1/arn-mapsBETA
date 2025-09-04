let map, routingControl;
let darkMode = false;
let userMarker = null;
let userCircle = null;
let destination = null;
let userPos = null;

// Init map
function initMap() {
  map = L.map("map").setView([59.3293, 18.0686], 13); // Stockholm default

  const lightTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
  }).addTo(map);

  const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OSM &copy; Carto"
  });

  // Dark mode toggle
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    if (darkMode) {
      map.removeLayer(darkTiles);
      map.addLayer(lightTiles);
      document.body.classList.remove("dark");
    } else {
      map.removeLayer(lightTiles);
      map.addLayer(darkTiles);
      document.body.classList.add("dark");
    }
    darkMode = !darkMode;
  });

  // Locate once
  document.getElementById("locateBtn").addEventListener("click", () => {
    map.locate({ setView: true, maxZoom: 16 });
  });

  // Routing (no built-in UI)
  routingControl = L.Routing.control({
    waypoints: [],
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null,
    lineOptions: {
      styles: [{ color: "blue", weight: 5 }]
    }
  }).addTo(map);

  routingControl.on("routesfound", e => {
    let stepsHtml = "";
    e.routes[0].instructions.forEach(i => {
      stepsHtml += `<p>${i.text}</p>`;
    });
    document.getElementById("steps").innerHTML = stepsHtml;
    document.getElementById("directionsPanel").classList.remove("collapsed");
  });

  // Search
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const place = data[0];
          const lat = parseFloat(place.lat);
          const lon = parseFloat(place.lon);
          map.setView([lat, lon], 14);

          if (destination) destination.remove();

          destination = L.marker([lat, lon]).addTo(map);
          destination.bindPopup(`<b>${place.display_name}</b><br><button onclick="setDestination(${lat}, ${lon})">Start Route</button>`).openPopup();
        }
      });
  });

  // Click map to add destination
  map.on("click", e => {
    const { lat, lng } = e.latlng;
    if (destination) destination.remove();

    destination = L.marker([lat, lng]).addTo(map);
    destination.bindPopup(`<b>Custom Point</b><br><button onclick="setDestination(${lat}, ${lng})">Start Route</button>`).openPopup();
  });

  // Start live GPS tracking
  startTracking();
}

// Set destination
function setDestination(lat, lon) {
  if (userPos) {
    routingControl.setWaypoints([L.latLng(userPos.lat, userPos.lng), L.latLng(lat, lon)]);
  }
}

// Live tracking
function startTracking() {
  if (!navigator.geolocation) return alert("Geolocation not supported");

  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    userPos = { lat, lng: lon };

    if (userMarker) {
      userMarker.setLatLng([lat, lon]);
      userCircle.setLatLng([lat, lon]);
      userCircle.setRadius(pos.coords.accuracy);
    } else {
      userMarker = L.marker([lat, lon], { icon: L.icon({
        iconUrl: "https://img.icons8.com/fluency/48/street-view.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }) }).addTo(map);
      userCircle = L.circle([lat, lon], { radius: pos.coords.accuracy }).addTo(map);
    }

    // Auto follow when moving
    map.setView([lat, lon], 16);

    // Update route automatically if destination exists
    if (destination) {
      setDestination(destination.getLatLng().lat, destination.getLatLng().lng);
    }
  }, err => console.error(err), { enableHighAccuracy: true });
}

initMap();
