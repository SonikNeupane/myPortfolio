// toggle icon navbar

let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

// Scroll Sections Active Links

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });

  // Sticky navbar

  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);

  //    remove toggle icon and navbar when click navbar link

  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
};

// scroll reveal

ScrollReveal({
//   reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});
ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(".home-img, .services-container, .portfolio-box, .contact form", { origin: "bottom" });
ScrollReveal().reveal(".home-content h1, .about-img", { origin: "left" });
ScrollReveal().reveal(".home-content p, .about-content", { origin: "right" });

// typed js

const typed = new Typed('.multiple-text', {
    strings: ['Geomatics Engineer', 'GIS Enthusiast'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
    });


    // Leaflet map
const myMap = L.map('map').setView([27.619010911424446, 85.53847006843908], 11); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(myMap);

const homeMarker = L.marker([27.67250532378781, 85.35113924226462]).addTo(myMap);
homeMarker.bindPopup("📍 My Residence").openPopup();

const hometownMarker = L.marker([27.617211867687455, 85.57106599558934]).addTo(myMap);
hometownMarker.bindPopup("📍 My Hometown").openPopup();

const schoolMarker = L.marker([27.66840597285729, 85.35021214355604]).addTo(myMap);
schoolMarker.bindPopup("📍 I passed SEE from here.").openPopup();

const collegeMarker = L.marker([27.69334841330892, 85.3211183668174]).addTo(myMap);
collegeMarker.bindPopup("📍 I passed +2 from here.").openPopup();

const universityMarker = L.marker([27.619010911424446, 85.53847006843908]).addTo(myMap);
universityMarker.bindPopup("📍 I graduated in Geomatics Engineering from here.").openPopup();






// ---------------------------------------

// Define keyLocations with your important points (latitude, longitude)
const keyLocations = {
  "My Residence": [27.67250532378781, 85.35113924226462],
  "My Hometown": [27.617211867687455, 85.57106599558934],
  "My School (SEE)": [27.66840597285729, 85.35021214355604],
  "My +2 College": [27.69334841330892, 85.3211183668174],
  "My University": [27.619010911424446, 85.53847006843908]
};


// Toggle tool options panel
document.getElementById("toggle-tools-btn").addEventListener("click", () => {
  const toolOptions = document.getElementById("tools-options");
  toolOptions.style.display = toolOptions.style.display === "none" ? "block" : "none";

  // Clear tool instruction when hiding
  if (toolOptions.style.display === "none") {
    document.getElementById("tool-instruction").innerText = "";
  }
});

// Tool States
let currentTool = null;

// Instruction Text DOM Element
const instructionText = document.getElementById("tool-instruction");

// Coordinate conversion helper: decimal degrees to DMS
function toDMS(deg) {
  const d = Math.floor(Math.abs(deg));
  const minFloat = (Math.abs(deg) - d) * 60;
  const m = Math.floor(minFloat);
  const s = ((minFloat - m) * 60).toFixed(2);
  const direction = deg >= 0 ? (deg === lat ? "N" : "E") : (deg === lat ? "S" : "W");
  return `${d}°${m}'${s}"`;
}

// Activate Distance Tool
document.getElementById("distanceToolBtn").addEventListener("click", () => {
  currentTool = "distance";
  instructionText.innerText = "🧭 Click anywhere on the map to measure distances to key locations.";
});

// Activate Nearest Location Tool
document.getElementById("nearestToolBtn").addEventListener("click", () => {
  currentTool = "nearest";
  instructionText.innerText = "📍 Click on the map to find the nearest marked location.";
});

// Activate Coordinate Display Tool (replaces LULC tool)
document.getElementById("lulcInfoBtn").addEventListener("click", () => {
  currentTool = "coordinate";
  instructionText.innerText = "📌 Click anywhere on the map to get coordinates (Decimal & DMS).";
});

// Shared map click handler for all tools
myMap.on("click", function (e) {
  const clickPoint = turf.point([e.latlng.lng, e.latlng.lat]);

  if (currentTool === "distance") {
    let resultHTML = `<b>Distance from Clicked Point:</b><br><ul>`;
    for (const name in keyLocations) {
      const loc = turf.point([keyLocations[name][1], keyLocations[name][0]]);
      const dist = turf.distance(clickPoint, loc, { units: "kilometers" });
      resultHTML += `<li><b>${name}:</b> ${dist.toFixed(2)} km</li>`;
    }
    resultHTML += `</ul>`;
    L.popup().setLatLng(e.latlng).setContent(resultHTML).openOn(myMap);
  }

  else if (currentTool === "nearest") {
    let minDist = Infinity;
    let nearestName = "";
    for (const name in keyLocations) {
      const loc = turf.point([keyLocations[name][1], keyLocations[name][0]]);
      const dist = turf.distance(clickPoint, loc, { units: "kilometers" });
      if (dist < minDist) {
        minDist = dist;
        nearestName = name;
      }
    }
    L.popup().setLatLng(e.latlng).setContent(
      `<b>Nearest Location:</b><br>${nearestName}<br>Distance: ${minDist.toFixed(2)} km`
    ).openOn(myMap);
  }

  else if (currentTool === "coordinate") {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // DMS conversion helper function with fixed direction
    function toDMSwithDir(deg, isLat) {
      const d = Math.floor(Math.abs(deg));
      const minFloat = (Math.abs(deg) - d) * 60;
      const m = Math.floor(minFloat);
      const s = ((minFloat - m) * 60).toFixed(2);
      const direction = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
      return `${d}°${m}'${s}" ${direction}`;
    }

    const content = `
      <b>Coordinates:</b><br>
      Decimal Degrees:<br>
      Latitude: ${lat.toFixed(6)}<br>
      Longitude: ${lng.toFixed(6)}<br><br>
      DMS:<br>
      Latitude: ${toDMSwithDir(lat, true)}<br>
      Longitude: ${toDMSwithDir(lng, false)}
    `;

    L.popup().setLatLng(e.latlng).setContent(content).openOn(myMap);
  }
});
