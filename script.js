// ============================
// 🌍 Language support
// ============================
const i18n = {
  enUS: { name: "English (USA)", placeholder: "Enter destination", directions: "Directions",
    you_are_here: "You are here", no_instructions: "No directions available.",
    alert_need_location: "Please click ‘My Location’ first.",
    alert_dest_not_found: "Destination not found.",
    alert_no_route_yet: "No route yet. Click ‘View Route’ first.",
    alert_nav_started: "Navigation started. Your position will update.",
    alert_no_gps: "Geolocation not supported.",
    alert_get_location_failed: "Could not get your location.",
    tt_location: "My Location", tt_route: "View Route", tt_nav: "Start Navigation",
    status_ready: "Ready", status_geocoding: "Geocoding…", status_routing: "Calculating route…",
    status_routed: "Route ready", status_error: "Routing error" },
  enUK: { name: "English (UK)" }, sv: { name: "Svenska",
    placeholder: "Skriv destination", directions: "Vägbeskrivning",
    you_are_here: "Du är här", no_instructions: "Inga vägbeskrivningar tillgängliga.",
    alert_need_location: "Klicka på ‘Min plats’ först.",
    alert_dest_not_found: "Destinationen hittades inte.",
    alert_no_route_yet: "Ingen rutt ännu. Klicka ‘Visa rutt’ först.",
    alert_nav_started: "Navigering startad. Din position uppdateras.",
    alert_no_gps: "Platsdelning stöds ej.",
    alert_get_location_failed: "Kunde inte hämta din plats.",
    tt_location: "Min plats", tt_route: "Visa rutt", tt_nav: "Starta navigering",
    status_ready: "Klar", status_geocoding: "Geokodar…", status_routing: "Beräknar rutt…",
    status_routed: "Rutt klar", status_error: "Ruttfel" },
  tr: { name: "Türkçe", placeholder: "Hedef girin", directions: "Yol Tarifi",
    you_are_here: "Buradasınız", no_instructions: "Yol tarifi mevcut değil.",
    alert_need_location: "Önce ‘Konumum’ düğmesine basın.",
    alert_dest_not_found: "Hedef bulunamadı.",
    alert_no_route_yet: "Henüz rota yok. Önce ‘Rotayı Göster’e tıklayın.",
    alert_nav_started: "Navigasyon başladı. Konumunuz güncellenecek.",
    alert_no_gps: "Konum özelliği desteklenmiyor.",
    alert_get_location_failed: "Konumunuz alınamadı.",
    tt_location: "Konumum", tt_route: "Rotayı Göster", tt_nav: "Navigasyonu Başlat",
    status_ready: "Hazır", status_geocoding: "Coğrafi kodlanıyor…",
    status_routing: "Rota hesaplanıyor…", status_routed: "Rota hazır",
    status_error: "Rota hatası" },
  no: { name: "Norsk", placeholder: "Skriv destinasjon", directions: "Veibeskrivelse",
    you_are_here: "Du er her", no_instructions: "Ingen veibeskrivelser tilgjengelig.",
    alert_need_location: "Klikk ‘Min posisjon’ først.",
    alert_dest_not_found: "Destinasjonen ble ikke funnet.",
    alert_no_route_yet: "Ingen rute ennå. Klikk ‘Vis rute’ først.",
    alert_nav_started: "Navigasjon startet. Posisjonen din oppdateres.",
    alert_no_gps: "Stedsdeling støttes ikke.",
    alert_get_location_failed: "Kunne ikke hente posisjonen din.",
    tt_location: "Min posisjon", tt_route: "Vis rute", tt_nav: "Start navigasjon",
    status_ready: "Klar", status_geocoding: "Geokoding…", status_routing: "Beregner rute…",
    status_routed: "Rute klar", status_error: "Ruttefeil" },
  fi: { name: "Suomi", placeholder: "Anna kohde", directions: "Reittiohjeet",
    you_are_here: "Olet tässä", no_instructions: "Reittiohjeita ei saatavilla.",
    alert_need_location: "Napsauta ensin ‘Sijaintini’.",
    alert_dest_not_found: "Kohdetta ei löytynyt.",
    alert_no_route_yet: "Ei vielä reittiä. Valitse ‘Näytä reitti’ ensin.",
    alert_nav_started: "Navigointi aloitettu. Sijainti päivittyy.",
    alert_no_gps: "Sijainti ei ole tuettu.",
    alert_get_location_failed: "Sijaintiasi ei voitu hakea.",
    tt_location: "Sijaintini", tt_route: "Näytä reitti", tt_nav: "Aloita navigointi",
    status_ready: "Valmis", status_geocoding: "Geokoodataan…",
    status_routing: "Lasketaan reittiä…", status_routed: "Reitti valmis",
    status_error: "Reittivirhe" },
  ru: { name: "Русский", placeholder: "Введите пункт назначения", directions: "Маршрут",
    you_are_here: "Вы здесь", no_instructions: "Инструкции недоступны.",
    alert_need_location: "Сначала нажмите «Моё местоположение».",
    alert_dest_not_found: "Пункт назначения не найден.",
    alert_no_route_yet: "Маршрута нет. Сначала нажмите «Показать маршрут».",
    alert_nav_started: "Навигация запущена. Ваша позиция будет обновляться.",
    alert_no_gps: "Геолокация не поддерживается.",
    alert_get_location_failed: "Не удалось получить ваше местоположение.",
    tt_location: "Моё местоположение", tt_route: "Показать маршрут", tt_nav: "Начать навигацию",
    status_ready: "Готово", status_geocoding: "Геокодирование…",
    status_routing: "Прокладывание маршрута…", status_routed: "Маршрут готов",
    status_error: "Ошибка маршрутизации" },
  de: { name: "Deutsch", placeholder: "Ziel eingeben", directions: "Wegbeschreibung",
    you_are_here: "Sie sind hier", no_instructions: "Keine Wegbeschreibung verfügbar.",
    alert_need_location: "Bitte zuerst ‘Mein Standort’ klicken.",
    alert_dest_not_found: "Ziel nicht gefunden.",
    alert_no_route_yet: "Noch keine Route. Erst ‘Route anzeigen’ klicken.",
    alert_nav_started: "Navigation gestartet. Ihre Position wird aktualisiert.",
    alert_no_gps: "Geolokalisierung wird nicht unterstützt.",
    alert_get_location_failed: "Ihr Standort konnte nicht ermittelt werden.",
    tt_location: "Mein Standort", tt_route: "Route anzeigen", tt_nav: "Navigation starten",
    status_ready: "Bereit", status_geocoding: "Geokodierung…", status_routing: "Route wird berechnet…",
    status_routed: "Route bereit", status_error: "Routingfehler" },
  nl: { name: "Nederlands", placeholder: "Voer bestemming in", directions: "Routebeschrijving",
    you_are_here: "U bent hier", no_instructions: "Geen routebeschrijving beschikbaar.",
    alert_need_location: "Klik eerst op ‘Mijn locatie’.",
    alert_dest_not_found: "Bestemming niet gevonden.",
    alert_no_route_yet: "Nog geen route. Klik eerst ‘Route bekijken’.",
    alert_nav_started: "Navigatie gestart. Uw positie wordt bijgewerkt.",
    alert_no_gps: "Geolocatie wordt niet ondersteund.",
    alert_get_location_failed: "Uw locatie kon niet worden opgehaald.",
    tt_location: "Mijn locatie", tt_route: "Route bekijken", tt_nav: "Navigatie starten",
    status_ready: "Gereed", status_geocoding: "Geocoderen…", status_routing: "Route berekenen…",
    status_routed: "Route gereed", status_error: "Routeringsfout" },
  es: { name: "Español", placeholder: "Ingrese destino", directions: "Indicaciones",
    you_are_here: "Estás aquí", no_instructions: "No hay indicaciones disponibles.",
    alert_need_location: "Haga clic primero en ‘Mi ubicación’.",
    alert_dest_not_found: "Destino no encontrado.",
    alert_no_route_yet: "Sin ruta aún. Primero ‘Ver ruta’.",
    alert_nav_started: "Navegación iniciada. Tu posición se actualizará.",
    alert_no_gps: "La geolocalización no es compatible.",
    alert_get_location_failed: "No se pudo obtener tu ubicación.",
    tt_location: "Mi ubicación", tt_route: "Ver ruta", tt_nav: "Iniciar navegación",
    status_ready: "Listo", status_geocoding: "Geocodificando…",
    status_routing: "Calculando ruta…", status_routed: "Ruta lista",
    status_error: "Error de enrutamiento" },
  it: { name: "Italiano", placeholder: "Inserisci destinazione", directions: "Indicazioni",
    you_are_here: "Sei qui", no_instructions: "Nessuna indicazione disponibile.",
    alert_need_location: "Fai prima clic su ‘La mia posizione’.",
    alert_dest_not_found: "Destinazione non trovata.",
    alert_no_route_yet: "Ancora nessun percorso. Clicca ‘Vedi percorso’ prima.",
    alert_nav_started: "Navigazione avviata. La tua posizione verrà aggiornata.",
    alert_no_gps: "Geolocalizzazione non supportata.",
    alert_get_location_failed: "Impossibile ottenere la tua posizione.",
    tt_location: "La mia posizione", tt_route: "Vedi percorso", tt_nav: "Avvia navigazione",
    status_ready: "Pronto", status_geocoding: "Geocodifica…",
    status_routing: "Calcolo del percorso…", status_routed: "Percorso pronto",
    status_error: "Errore di instradamento" }
};

// Detect language
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
const $ = id => document.getElementById(id);

// Elements
const toInput = $('to');
const langSelect = $('language');
const directionsTitle = $('directionsTitle');
const btnLoc = $('locBtn');
const btnView = $('viewBtn');
const btnNav = $('navBtn');

// Language dropdown
(function loadLangs(){
  while (langSelect.firstChild) langSelect.removeChild(langSelect.firstChild);
  Object.keys(i18n).forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = i18n[code].name;
    langSelect.appendChild(opt);
  });
  langSelect.value = currentLang;
})();
function T(){ return i18n[currentLang] || i18n.enUS; }
function applyLanguage(){
  const t = T();
  toInput.placeholder = t.placeholder || i18n.enUS.placeholder;
  directionsTitle.textContent = t.directions || i18n.enUS.directions;
  btnLoc.title = t.tt_location || i18n.enUS.tt_location;
  btnView.title = t.tt_route || i18n.enUS.tt_route;
  btnNav.title = t.tt_nav || i18n.enUS.tt_nav;
  statusSet(t.status_ready || i18n.enUS.status_ready);
}
applyLanguage();
langSelect.addEventListener('change', () => { currentLang = langSelect.value; applyLanguage(); rebuildGeocoder(); });

// ============================
// 🗺️ Map + Geocoder
// ============================
const map = L.map('map').setView([59.3293, 18.0686], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);

let userLocation = null;
let control = null;
let currentRoute = null;
let navMarker = null;
let geocoder = null;

// status line (tiny)
const statusEl = document.createElement('div');
statusEl.style.cssText = 'position:absolute;left:10px;bottom:10px;background:rgba(255,255,255,.9);padding:6px 10px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.25);z-index:1000;font:12px/1.2 Arial';
document.body.appendChild(statusEl);
function statusSet(msg){ statusEl.textContent = msg; }

// build geocoder with language
function rebuildGeocoder() {
  const langForNom = currentLang === 'enUK' ? 'en-GB' : (currentLang === 'enUS' ? 'en-US' : currentLang);
  geocoder = L.Control.Geocoder.nominatim({ geocodingQueryParams: { 'accept-language': langForNom } });
}
rebuildGeocoder();

// ============================
// 📍 My Location
// ============================
function useMyLocation() {
  const t = T();
  if (!navigator.geolocation) return alert(t.alert_no_gps || i18n.enUS.alert_no_gps);
  navigator.geolocation.getCurrentPosition(pos => {
    userLocation = L.latLng(pos.coords.latitude, pos.coords.longitude);
    L.marker(userLocation).addTo(map).bindPopup(t.you_are_here || i18n.enUS.you_are_here).openPopup();
    map.setView(userLocation, 14);
  }, () => alert(t.alert_get_location_failed || i18n.enUS.alert_get_location_failed), { enableHighAccuracy: true, timeout: 15000 });
}

// ============================
// 🔍 View Route (calc + zoom)
// ============================
function viewRoute() {
  const t = T();
  const dest = (toInput.value || '').trim();
  if (!userLocation) return alert(t.alert_need_location || i18n.enUS.alert_need_location);
  if (!dest) return;

  // Remove previous control
  if (control) { try { map.removeControl(control); } catch(_){} }

  // Create control
  control = L.Routing.control({
    waypoints: [],
    router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    show: false,
    routeWhileDragging: false,
    createMarker: (i, wp) => L.marker(wp.latLng, { draggable: false })
  }).addTo(map);

  // Events — set currentRoute on both events
  control.on('routesfound', e => {
    const route = e.routes && e.routes[0];
    if (route) {
      currentRoute = route;
      renderInstructions(route);
      fitRoute(route);
      statusSet(t.status_routed || i18n.enUS.status_routed);
    }
  });
  control.on('routeselected', e => {
    if (e.route) {
      currentRoute = e.route;
      renderInstructions(e.route);
      fitRoute(e.route);
      statusSet(t.status_routed || i18n.enUS.status_routed);
    }
  });
  control.on('routingerror', err => {
    console.error('Routing error', err);
    statusSet((t.status_error || i18n.enUS.status_error) + ' ⚠️');
    alert((t.status_error || i18n.enUS.status_error) + '. Try another destination or later.');
  });

  // Geocode destination then set waypoints
  statusSet(t.status_geocoding || i18n.enUS.status_geocoding);
  geocoder.geocode(dest, results => {
    if (!results || !results.length) {
      alert(t.alert_dest_not_found || i18n.enUS.alert_dest_not_found);
      statusSet(t.status_ready || i18n.enUS.status_ready);
      return;
    }
    const c = results[0].center;
    const toLatLng = L.latLng(c.lat, c.lng); // normalize to LatLng
    statusSet(t.status_routing || i18n.enUS.status_routing);
    control.setWaypoints([ userLocation, toLatLng ]);
  });
}

// Helpers
function renderInstructions(route) {
  const t = T();
  const stepsDiv = $('steps');
  stepsDiv.innerHTML = '';
  let instructions = [];
  if (route.instructions && route.instructions.length) {
    instructions = route.instructions.map(s => s.text);
  } else if (route.legs && route.legs.length && route.legs[0].steps) {
    instructions = route.legs[0].steps.map(step => {
      if (step.maneuver && step.maneuver.instruction) return step.maneuver.instruction;
      const typ = step.maneuver?.type || 'Continue';
      const mod = step.maneuver?.modifier ? ` ${step.maneuver.modifier}` : '';
      return `${typ}${mod}`;
    });
  }
  if (!instructions.length) {
    stepsDiv.innerHTML = `<p>${t.no_instructions || i18n.enUS.no_instructions}</p>`;
    return;
  }
  instructions.forEach(text => {
    const p = document.createElement('p');
    p.textContent = `➡️ ${text}`;
    stepsDiv.appendChild(p);
  });
}

function fitRoute(route) {
  try {
    map.fitBounds(L.Routing.line(route).getBounds(), { padding: [30,30] });
  } catch (e) {
    console.warn('fitRoute failed', e);
  }
}

// ============================
// ▶️ Start Navigation (GPS follow)
// ============================
function startNavigation() {
  const t = T();
  // As a safety: if control has selected route but currentRoute not yet set
  if (!currentRoute && control && control._selectedRoute) {
    currentRoute = control._selectedRoute;
  }
  if (!currentRoute) return alert(t.alert_no_route_yet || i18n.enUS.alert_no_route_yet);
  if (!navigator.geolocation) return alert(t.alert_no_gps || i18n.enUS.alert_no_gps);

  alert(t.alert_nav_started || i18n.enUS.alert_nav_started);

  navigator.geolocation.watchPosition(pos => {
    const latlng = [pos.coords.latitude, pos.coords.longitude];
    if (!navMarker) {
      navMarker = L.marker(latlng, {
        icon: L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png", iconSize: [30,30] })
      }).addTo(map);
    } else {
      navMarker.setLatLng(latlng);
    }
    map.setView(latlng, 16);
  }, () => alert(t.alert_get_location_failed || i18n.enUS.alert_get_location_failed), { enableHighAccuracy: true });
}

// ============================
// 🎛️ Hook up Buttons
// ============================
btnLoc.addEventListener('click', useMyLocation);
btnView.addEventListener('click', viewRoute);
btnNav.addEventListener('click', startNavigation);

// Initial status
statusSet(T().status_ready || i18n.enUS.status_ready);
