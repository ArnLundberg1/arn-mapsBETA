// ============================
// 🌍 Language support
// ============================
const i18n = {
  enUS: {
    name: "English (USA)",
    placeholder: "Enter destination",
    directions: "Directions",
    you_are_here: "You are here",
    no_instructions: "No directions available.",
    alert_need_location: "Please click ‘My Location’ first.",
    alert_dest_not_found: "Destination not found.",
    alert_no_route_yet: "No route yet. Click ‘View Route’ first.",
    alert_nav_started: "Navigation started. Your position will update.",
    alert_no_gps: "Geolocation not supported.",
    alert_get_location_failed: "Could not get your location.",
    tt_location: "My Location",
    tt_route: "View Route",
    tt_nav: "Start Navigation"
  },
  enUK: {
    name: "English (UK)",
    placeholder: "Enter destination",
    directions: "Directions",
    you_are_here: "You are here",
    no_instructions: "No directions available.",
    alert_need_location: "Please click ‘My Location’ first.",
    alert_dest_not_found: "Destination not found.",
    alert_no_route_yet: "No route yet. Click ‘View Route’ first.",
    alert_nav_started: "Navigation started. Your position will update.",
    alert_no_gps: "Geolocation not supported.",
    alert_get_location_failed: "Could not get your location.",
    tt_location: "My Location",
    tt_route: "View Route",
    tt_nav: "Start Navigation"
  },
  sv: {
    name: "Svenska",
    placeholder: "Skriv destination",
    directions: "Vägbeskrivning",
    you_are_here: "Du är här",
    no_instructions: "Inga vägbeskrivningar tillgängliga.",
    alert_need_location: "Klicka på ‘Min plats’ först.",
    alert_dest_not_found: "Destinationen hittades inte.",
    alert_no_route_yet: "Ingen rutt ännu. Klicka ‘Visa rutt’ först.",
    alert_nav_started: "Navigering startad. Din position uppdateras.",
    alert_no_gps: "Platsdelning stöds ej.",
    alert_get_location_failed: "Kunde inte hämta din plats.",
    tt_location: "Min plats",
    tt_route: "Visa rutt",
    tt_nav: "Starta navigering"
  },
  tr: {
    name: "Türkçe",
    placeholder: "Hedef girin",
    directions: "Yol Tarifi",
    you_are_here: "Buradasınız",
    no_instructions: "Yol tarifi mevcut değil.",
    alert_need_location: "Önce ‘Konumum’ düğmesine basın.",
    alert_dest_not_found: "Hedef bulunamadı.",
    alert_no_route_yet: "Henüz rota yok. Önce ‘Rotayı Göster’e tıklayın.",
    alert_nav_started: "Navigasyon başladı. Konumunuz güncellenecek.",
    alert_no_gps: "Konum özelliği desteklenmiyor.",
    alert_get_location_failed: "Konumunuz alınamadı.",
    tt_location: "Konumum",
    tt_route: "Rotayı Göster",
    tt_nav: "Navigasyonu Başlat"
  },
  no: {
    name: "Norsk",
    placeholder: "Skriv destinasjon",
    directions: "Veibeskrivelse",
    you_are_here: "Du er her",
    no_instructions: "Ingen veibeskrivelser tilgjengelig.",
    alert_need_location: "Klikk ‘Min posisjon’ først.",
    alert_dest_not_found: "Destinasjonen ble ikke funnet.",
    alert_no_route_yet: "Ingen rute ennå. Klikk ‘Vis rute’ først.",
    alert_nav_started: "Navigasjon startet. Posisjonen din oppdateres.",
    alert_no_gps: "Stedsdeling støttes ikke.",
    alert_get_location_failed: "Kunne ikke hente posisjonen din.",
    tt_location: "Min posisjon",
    tt_route: "Vis rute",
    tt_nav: "Start navigasjon"
  },
  fi: {
    name: "Suomi",
    placeholder: "Anna kohde",
    directions: "Reittiohjeet",
    you_are_here: "Olet tässä",
    no_instructions: "Reittiohjeita ei saatavilla.",
    alert_need_location: "Napsauta ensin ‘Sijaintini’.",
    alert_dest_not_found: "Kohdetta ei löytynyt.",
    alert_no_route_yet: "Ei vielä reittiä. Valitse ‘Näytä reitti’ ensin.",
    alert_nav_started: "Navigointi aloitettu. Sijainti päivittyy.",
    alert_no_gps: "Sijainti ei ole tuettu.",
    alert_get_location_failed: "Sijaintiasi ei voitu hakea.",
    tt_location: "Sijaintini",
    tt_route: "Näytä reitti",
    tt_nav: "Aloita navigointi"
  },
  ru: {
    name: "Русский",
    placeholder: "Введите пункт назначения",
    directions: "Маршрут",
    you_are_here: "Вы здесь",
    no_instructions: "Инструкции недоступны.",
    alert_need_location: "Сначала нажмите «Моё местоположение».",
    alert_dest_not_found: "Пункт назначения не найден.",
    alert_no_route_yet: "Маршрута нет. Сначала нажмите «Показать маршрут».",
    alert_nav_started: "Навигация запущена. Ваша позиция будет обновляться.",
    alert_no_gps: "Геолокация не поддерживается.",
    alert_get_location_failed: "Не удалось получить ваше местоположение.",
    tt_location: "Моё местоположение",
    tt_route: "Показать маршрут",
    tt_nav: "Начать навигацию"
  },
  de: {
    name: "Deutsch",
    placeholder: "Ziel eingeben",
    directions: "Wegbeschreibung",
    you_are_here: "Sie sind hier",
    no_instructions: "Keine Wegbeschreibung verfügbar.",
    alert_need_location: "Bitte zuerst ‘Mein Standort’ klicken.",
    alert_dest_not_found: "Ziel nicht gefunden.",
    alert_no_route_yet: "Noch keine Route. Erst ‘Route anzeigen’ klicken.",
    alert_nav_started: "Navigation gestartet. Ihre Position wird aktualisiert.",
    alert_no_gps: "Geolokalisierung wird nicht unterstützt.",
    alert_get_location_failed: "Ihr Standort konnte nicht ermittelt werden.",
    tt_location: "Mein Standort",
    tt_route: "Route anzeigen",
    tt_nav: "Navigation starten"
  },
  nl: {
    name: "Nederlands",
    placeholder: "Voer bestemming in",
    directions: "Routebeschrijving",
    you_are_here: "U bent hier",
    no_instructions: "Geen routebeschrijving beschikbaar.",
    alert_need_location: "Klik eerst op ‘Mijn locatie’.",
    alert_dest_not_found: "Bestemming niet gevonden.",
    alert_no_route_yet: "Nog geen route. Klik eerst ‘Route bekijken’.",
    alert_nav_started: "Navigatie gestart. Uw positie wordt bijgewerkt.",
    alert_no_gps: "Geolocatie wordt niet ondersteund.",
    alert_get_location_failed: "Uw locatie kon niet worden opgehaald.",
    tt_location: "Mijn locatie",
    tt_route: "Route bekijken",
    tt_nav: "Navigatie starten"
  },
  es: {
    name: "Español",
    placeholder: "Ingrese destino",
    directions: "Indicaciones",
    you_are_here: "Estás aquí",
    no_instructions: "No hay indicaciones disponibles.",
    alert_need_location: "Haga clic primero en ‘Mi ubicación’.",
    alert_dest_not_found: "Destino no encontrado.",
    alert_no_route_yet: "Sin ruta aún. Primero ‘Ver ruta’.",
    alert_nav_started: "Navegación iniciada. Tu posición se actualizará.",
    alert_no_gps: "La geolocalización no es compatible.",
    alert_get_location_failed: "No se pudo obtener tu ubicación.",
    tt_location: "Mi ubicación",
    tt_route: "Ver ruta",
    tt_nav: "Iniciar navegación"
  },
  it: {
    name: "Italiano",
    placeholder: "Inserisci destinazione",
    directions: "Indicazioni",
    you_are_here: "Sei qui",
    no_instructions: "Nessuna indicazione disponibile.",
    alert_need_location: "Fai prima clic su ‘La mia posizione’.",
    alert_dest_not_found: "Destinazione non trovata.",
    alert_no_route_yet: "Ancora nessun percorso. Clicca ‘Vedi percorso’ prima.",
    alert_nav_started: "Navigazione avviata. La tua posizione verrà aggiornata.",
    alert_no_gps: "Geolocalizzazione non supportata.",
    alert_get_location_failed: "Impossibile ottenere la tua posizione.",
    tt_location: "La mia posizione",
    tt_route: "Vedi percorso",
    tt_nav: "Avvia navigazione"
  }
};

// Preferred language detection
function detectLang() {
  const nav = (navigator.language || 'en-US').toLowerCase();
  if (nav.startsWith('sv')) return 'sv';
  if (nav.startsWith('en-gb')) return 'enUK';
  if (nav.startsWith('en')) return 'enUS';
  if (nav.startsWith('tr')) return 'tr';
  if (nav.startsWith('no') || nav.startsWith('nb') || nav.startsWith('nn')) return 'no';
  if (nav.startsWith('fi')) return 'fi';
  if (nav.startsWith('ru')) return 'ru';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('nl')) return 'nl';
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('it')) return 'it';
  return 'enUS';
}

let currentLang = detectLang();
const LANGS = Object.keys(i18n);

// Helpers to access UI elements
const $ = (id) => document.getElementById(id);
const toInput = $('to');
const langSelect = $('language');
const directionsTitle = $('directionsTitle');
const btnLoc = $('locBtn');
const btnView = $('viewBtn');
const btnNav = $('navBtn');

// Populate language dropdown
(function populateLanguageSelect() {
  // If index.html already has options, clear them to avoid duplicates
  while (langSelect.firstChild) langSelect.removeChild(langSelect.firstChild);
  LANGS.forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = i18n[code].name;
    langSelect.appendChild(opt);
  });
  langSelect.value = currentLang;
})();

// Apply language to UI
function applyLanguage() {
  const t = i18n[currentLang] || i18n.enUS;
  toInput.placeholder = t.placeholder;
  directionsTitle.textContent = t.directions;
  btnLoc.title = t.tt_location;
  btnView.title = t.tt_route;
  btnNav.title = t.tt_nav;
}
applyLanguage();

langSelect.addEventListener('change', () => {
  currentLang = langSelect.value;
  applyLanguage();
  rebuildGeocoder(); // update accept-language for geocoding
});

// ============================
// 🗺️ Map + Geocoder Setup
// ============================
const map = L.map('map').setView([59.3293, 18.0686], 6); // Stockholm default
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let userLocation = null;
let control = null;
let currentRoute = null;
let navMarker = null;
let geocoder = null;

function rebuildGeocoder() {
  const langForNominatim = currentLang === 'enUK' ? 'en-GB' :
                           currentLang === 'enUS' ? 'en-US' :
                           currentLang; // use code as-is for others
  geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: { 'accept-language': langForNominatim }
  });
}
rebuildGeocoder();

// ============================
// 📍 Get User Location
// ============================
function useMyLocation() {
  const t = i18n[currentLang] || i18n.enUS;
  if (!navigator.geolocation) {
    alert(t.alert_no_gps);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation = L.latLng(pos.coords.latitude, pos.coords.longitude);
      L.marker(userLocation).addTo(map).bindPopup(t.you_are_here).openPopup();
      map.setView(userLocation, 14);
    },
    () => alert(t.alert_get_location_failed),
    { enableHighAccuracy: true, timeout: 15000 }
  );
}

// ============================
// 🔍 View Route (calculate + zoom)
// ============================
function viewRoute() {
  const t = i18n[currentLang] || i18n.enUS;
  const to = toInput.value.trim();
  if (!userLocation) {
    alert(t.alert_need_location);
    return;
  }
  if (!to) return;

  if (control) map.removeControl(control);

  control = L.Routing.control({
    waypoints: [],
    router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    geocoder: geocoder,
    show: false,
    routeWhileDragging: false,
    createMarker: (i, wp) => L.marker(wp.latLng, { draggable: false })
  }).addTo(map);

  // Attach event BEFORE setting waypoints to avoid race conditions
  control.on('routesfound', function(e) {
    const stepsDiv = $('steps');
    stepsDiv.innerHTML = "";
    const route = e.routes[0];
    currentRoute = route; // ✅ so Navigation works

    // Extract instructions safely
    let instructions = [];
    if (route.instructions && route.instructions.length) {
      instructions = route.instructions.map(s => s.text);
    } else if (route.legs && route.legs.length && route.legs[0].steps) {
      // Fallback (not typical for LRM, but just in case)
      instructions = route.legs[0].steps.map(step => {
        if (step.maneuver && step.maneuver.instruction) return step.maneuver.instruction;
        // crude fallback string
        const typ = step.maneuver?.type || 'Continue';
        const mod = step.maneuver?.modifier ? ` ${step.maneuver.modifier}` : '';
        return `${typ}${mod}`;
      });
    }

    if (instructions.length === 0) {
      stepsDiv.innerHTML = `<p>${t.no_instructions}</p>`;
    } else {
      instructions.forEach(text => {
        const p = document.createElement('p');
        p.textContent = `➡️ ${text}`;
        stepsDiv.appendChild(p);
      });
    }

    // Fit map to route
    try {
      map.fitBounds(L.Routing.line(route).getBounds(), { padding: [30, 30] });
    } catch {
      // If that fails for some reason, just keep current view
    }
  });

  // Geocode destination with selected language
  geocoder.geocode(to, function(results) {
    if (results && results.length > 0) {
      const toCoord = results[0].center;
      control.setWaypoints([userLocation, toCoord]);
    } else {
      alert(t.alert_dest_not_found);
    }
  });
}

// ============================
// ▶️ Start Live Navigation (GPS follows)
// ============================
function startNavigation() {
  const t = i18n[currentLang] || i18n.enUS;
  if (!currentRoute) {
    alert(t.alert_no_route_yet);
    return;
  }
  if (!navigator.geolocation) {
    alert(t.alert_no_gps);
    return;
  }

  alert(t.alert_nav_started);

  navigator.geolocation.watchPosition(pos => {
    const latlng = [pos.coords.latitude, pos.coords.longitude];

    if (!navMarker) {
      navMarker = L.marker(latlng, {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
          iconSize: [30, 30]
        })
      }).addTo(map);
    } else {
      navMarker.setLatLng(latlng);
    }
    map.setView(latlng, 16);
  }, () => {
    alert(t.alert_get_location_failed);
  }, { enableHighAccuracy: true });
}

// ============================
// 🎛️ Hook up Buttons
// ============================
btnLoc.addEventListener("click", useMyLocation);
btnView.addEventListener("click", viewRoute);
btnNav.addEventListener("click", startNavigation);
