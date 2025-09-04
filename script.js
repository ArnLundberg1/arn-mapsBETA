// 🌍 Language support
const translations = {
  en: { name: "English (USA)", placeholder: "Enter destination", directions: "Directions" },
  enUK: { name: "English (UK)", placeholder: "Enter destination", directions: "Directions" },
  sv: { name: "Svenska", placeholder: "Skriv destination", directions: "Vägbeskrivning" },
  tr: { name: "Türkçe", placeholder: "Hedef girin", directions: "Yol Tarifi" },
  no: { name: "Norsk", placeholder: "Skriv destinasjon", directions: "Veibeskrivelse" },
  fi: { name: "Suomi", placeholder: "Anna kohde", directions: "Reittiohjeet" },
  ru: { name: "Русский", placeholder: "Введите пункт назначения", directions: "Маршрут" },
  de: { name: "Deutsch", placeholder: "Ziel eingeben", directions: "Wegbeschreibung" },
  nl: { name: "Nederlands", placeholder: "Voer bestemming in", directions: "Routebeschrijving" },
  es: { name: "Español", placeholder: "Ingrese destino", directions: "Indicaciones" },
  it: { name: "Italiano", placeholder: "Inserisci destinazione", directions: "Indicazioni" },
};

// Populate language dropdown
const langSelect = document.getElementById("language");
for (let code in translations) {
  const opt = document.createElement("option");
  opt.value = code;
  opt.textContent = translations[code].name;
  langSelect.appendChild(opt);
}
langSelect.value = "en"; // default

function updateLanguage(lang) {
  document.getElementById("to").placeholder = translations[lang].placeholder;
  document.getElementById("directionsTitle").textContent = translations[lang].directions;
}

// Init language
updateLanguage(langSelect.value);
langSelect.addEventListener("change", () => updateLanguage(langSelect.value));

// 🗺️ Map setup
const map = L.map('map').setView([59.3293, 18.0686], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let userLocation = null;
let control = null;
let currentRoute = null;
let navMarker = null;

// 📍 Location
function useMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      userLocation = L.latLng(pos.coords.latitude, pos.coords.longitude);
      L.marker(userLocation).addTo(map).bindPopup("You are here").openPopup();
      map.setView(userLocation, 14);
    }, () => alert("Could not get your location"));
  } else {
    alert("Your browser does not support GPS");
  }
}

// 🔍 View route
function viewRoute() {
  const to = document.getElementById("to").value;
  if (!userLocation) {
    alert("Please click 'My Location' first.");
    return;
  }

  if (control) map.removeControl(control);

  control = L.Routing.control({
    waypoints: [],
    router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    geocoder: L.Control.Geocoder.nominatim(),
    show: false,
    routeWhileDragging: false,
    createMarker: (i, wp, nWps) => L.marker(wp.latLng, { draggable: false })
  }).addTo(map);

  L.Control.Geocoder.nominatim().geocode(to, function(results) {
    if (results.length > 0) {
      const toCoord = results[0].center;
      control.setWaypoints([userLocation, toCoord]);

      control.on('routesfound', function(e) {
        const stepsDiv = document.getElementById("steps");
        stepsDiv.innerHTML = "";
        const route = e.routes[0];
        currentRoute = route;

        route.instructions.forEach(step => {
          stepsDiv.innerHTML += `<p>➡️ ${step.text}</p>`;
        });

        map.fitBounds(L.Routing.line(route).getBounds());
      });
    } else {
      alert("Destination not found.");
    }
  });
}

// ▶️ Navigation
function startNavigation() {
  if (!currentRoute) {
    alert("No route yet. Click 'View Route' first.");
    return;
  }

  if (!navigator.geolocation) {
    alert("GPS not supported.");
    return;
  }

  alert("Navigation started. Your location will update.");

  navigator.geolocation.watchPosition(pos => {
    const latlng = [pos.coords.latitude, pos.coords.longitude];

    if (!navMarker) {
      navMarker = L.marker(latlng, { icon: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
        iconSize: [30, 30]
      }) }).addTo(map);
    } else {
      navMarker.setLatLng(latlng);
    }

    map.setView(latlng, 16);
  });
}

// 🎛️ Event listeners
document.getElementById("locBtn").addEventListener("click", useMyLocation);
document.getElementById("viewBtn").addEventListener("click", viewRoute);
document.getElementById("navBtn").addEventListener("click", startNavigation);
