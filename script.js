let map, directionsService, directionsRenderer;
let darkMode = false;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 59.3293, lng: 18.0686 }, // Stockholm
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });

  // Search destination
  document.getElementById("searchBtn").addEventListener("click", () => {
    calculateRoute();
  });

  // Enter key = search
  document.getElementById("destination").addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateRoute();
  });

  // GPS button
  document.getElementById("gpsBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        let position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        map.setCenter(position);
        map.setZoom(14);
        new google.maps.Marker({ position, map });
      });
    }
  });

  // Dark mode toggle
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
  });

  // Collapsible panel
  const panel = document.getElementById("directionsPanel");
  document.getElementById("panelHeader").addEventListener("click", () => {
    panel.classList.toggle("collapsed");
  });
}

// Calculate route
function calculateRoute() {
  let destination = document.getElementById("destination").value;
  if (!destination) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      let origin = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
            showSteps(result.routes[0].legs[0].steps);
          } else {
            alert("Could not find route: " + status);
          }
        }
      );
    });
  }
}

// Show steps in panel
function showSteps(steps) {
  const stepsDiv = document.getElementById("steps");
  stepsDiv.innerHTML = "";
  steps.forEach(step => {
    stepsDiv.innerHTML += `<p>${step.instructions}</p>`;
  });

  // Expand panel
  document.getElementById("directionsPanel").classList.remove("collapsed");
}
