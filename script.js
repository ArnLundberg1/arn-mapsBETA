/* Smart Navigation – Google/Apple/Waze–style */
let map, places, directionsService, directionsRenderer, autocomplete;
let currentMode = "DRIVING";
let darkMode = false;
let lastCenter = { lat: 59.3293, lng: 18.0686 }; // Stockholm default
let lastZoom = 12;
let currentRouteLeg = null;

/* ---- Map styles ---- */
const darkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

/* ---- Init ---- */
window.initMap = function () {
  // Load saved prefs
  const saved = JSON.parse(localStorage.getItem("smartNavPrefs") || "{}");
  currentMode = saved.mode || "DRIVING";
  darkMode = !!saved.darkMode;
  const savedUnits = saved.units || "METRIC";
  [...document.querySelectorAll('input[name="units"]')].forEach(r => r.checked = (r.value === savedUnits));

  map = new google.maps.Map(document.getElementById("map"), {
    center: lastCenter, zoom: lastZoom, mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    styles: darkMode ? darkStyle : null
  });

  places = new google.maps.places.PlacesService(map);
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map, suppressMarkers: false });

  // Autocomplete for destination
  const destInput = document.getElementById("destination");
  autocomplete = new google.maps.places.Autocomplete(destInput, { fields: ["geometry", "name"] });

  // UI listeners
  document.getElementById("searchBtn").addEventListener("click", calculateRoute);
  destInput.addEventListener("keypress", (e) => (e.key === "Enter") && calculateRoute());
  document.getElementById("gpsBtn").addEventListener("click", goToMyLocation);
  document.getElementById("recenterBtn").addEventListener("click", () => map.panTo(lastCenter));
  document.getElementById("clearBtn").addEventListener("click", clearRoute);

  // Dark mode toggle
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
    map.setOptions({ styles: darkMode ? darkStyle : null });
    // change icon between moon/sun
    document.getElementById("themeIcon").src = darkMode
      ? "https://img.icons8.com/ios-filled/50/sun--v1.png"
      : "https://img.icons8.com/ios-filled/50/do-not-disturb-2.png";
    savePrefs();
  });
  if (darkMode) document.body.classList.add("dark");

  // Panel collapse/expand
  const panel = document.getElementById("directionsPanel");
  document.getElementById("panelHeader").addEventListener("click", () =>
    panel.classList.toggle("collapsed")
  );

  // Mode tabs
  document.querySelectorAll("#modeTabs .mode").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === currentMode);
    btn.addEventListener("click", () => {
      document.querySelectorAll("#modeTabs .mode").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMode = btn.dataset.mode;
      savePrefs();
      calculateRoute();
    });
  });

  // Options
  document.getElementById("avoidTolls").addEventListener("change", () => { savePrefs(); calculateRoute(); });
  document.getElementById("avoidHighways").addEventListener("change", () => { savePrefs(); calculateRoute(); });
  document.querySelectorAll('input[name="units"]').forEach(r => r.addEventListener("change", () => { savePrefs(); calculateRoute(); }));

  // Simple menu
  document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sideMenu").classList.toggle("hidden"));
  document.getElementById("closeMenu").addEventListener("click", () => document.getElementById("sideMenu").classList.add("hidden"));

  // Voice search
  setupVoiceSearch();

  // Keep last center/zoom
  map.addListener("idle", () => {
    const c = map.getCenter();
    lastCenter = { lat: c.lat(), lng: c.lng() };
    lastZoom = map.getZoom();
  });
};

/* ---- Geolocation ---- */
function goToMyLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");
  navigator.geolocation.getCurrentPosition(pos => {
    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    map.setCenter(loc);
    map.setZoom(15);
    new google.maps.Marker({ position: loc, map, animation: google.maps.Animation.DROP });
  }, () => alert("Unable to get your location."));
}

/* ---- Route calculation ---- */
function calculateRoute() {
  const destField = document.getElementById("destination");
  let destination = destField.value?.trim();
  if (!destination && autocomplete?.getPlace?.()) {
    const p = autocomplete.getPlace();
    destination = p?.name || "";
  }
  if (!destination) return;

  // Get current location for origin
  if (!navigator.geolocation) return alert("Enable geolocation to get directions.");
  navigator.geolocation.getCurrentPosition(pos => {
    const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };

    const avoidTolls = document.getElementById("avoidTolls").checked;
    const avoidHighways = document.getElementById("avoidHighways").checked;
    const units = document.querySelector('input[name="units"]:checked')?.value || "METRIC";

    const req = {
      origin,
      destination,
      travelMode: google.maps.TravelMode[currentMode],
      avoidTolls,
      avoidHighways,
      unitSystem: units === "IMPERIAL" ? google.maps.UnitSystem.IMPERIAL : google.maps.UnitSystem.METRIC,
      provideRouteAlternatives: false
    };

    directionsService.route(req, (result, status) => {
      if (status !== "OK") {
        alert("Route error: " + status);
        return;
      }
      directionsRenderer.setDirections(result);
      const leg = result.routes[0].legs[0];
      currentRouteLeg = leg;

      // Summary
      const distance = leg.distance?.text || "";
      const duration = leg.duration?.text || "";
      document.getElementById("routeSummary").textContent = `${duration} • ${distance}`;

      // Steps
      const stepsDiv = document.getElementById("steps");
      stepsDiv.innerHTML = "";
      stepsDiv.insertAdjacentHTML("beforeend", `<p class="eta">Estimated: ${duration}, ${distance}</p>`);
      leg.steps.forEach(step => {
        stepsDiv.insertAdjacentHTML("beforeend", `<p>${step.instructions}</p>`);
      });

      // Expand panel
      document.getElementById("directionsPanel").classList.remove("collapsed");

      // Voice guidance (optional)
      if (document.getElementById("voiceGuidance").checked) speakNextInstruction(leg);
    });
  }, () => alert("Unable to get your location."));
}

/* ---- Clear ---- */
function clearRoute() {
  directionsRenderer.setDirections({ routes: [] });
  document.getElementById("steps").innerHTML = "";
  document.getElementById("routeSummary").textContent = "Search for a place to start.";
}

/* ---- Voice search ---- */
function setupVoiceSearch() {
  const micBtn = document.getElementById("micBtn");
  const dest = document.getElementById("destination");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    micBtn.style.opacity = .4;
    micBtn.title = "Voice not supported";
    return;
  }
  const rec = new SR();
  rec.lang = navigator.language || "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {
    rec.start();
  });
  rec.onresult = (e) => {
    const txt = e.results[0][0].transcript;
    dest.value = txt;
    calculateRoute();
  };
}

/* ---- Voice guidance (simple) ---- */
function speakNextInstruction(leg) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const text = leg.steps?.[0]?.instructions?.replace(/<[^>]*>?/gm, '') || "Navigation started";
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = navigator.language || "en-US";
    synth.cancel();
    synth.speak(msg);
  } catch (e) { /* ignore */ }
}

/* ---- Save prefs ---- */
function savePrefs() {
  const units = document.querySelector('input[name="units"]:checked')?.value || "METRIC";
  const prefs = { mode: currentMode, darkMode, units };
  localStorage.setItem("smartNavPrefs", JSON.stringify(prefs));
}
