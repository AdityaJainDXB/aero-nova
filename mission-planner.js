// AERO/NOVA ADVANCED MISSION PLANNER

const ORIGIN = {
  name: "Aurelia Orbital Port",
  lat: 0,
  lon: 0
};

// Fictional destinations with coordinates.

const DESTINATIONS = {
  kepler: {
    name: "Kepler Station",
    lat: 12.5,
    lon: 35.2
  },

  titan: {
    name: "Titan Research Base",
    lat: -20.4,
    lon: 80.1
  },

  mars: {
    name: "Mars Colony",
    lat: 45.2,
    lon: -60.5
  },

  europa: {
    name: "Europa Outpost",
    lat: -35.6,
    lon: -110.2
  },

  zenith: {
    name: "Zenith City",
    lat: 60.1,
    lon: 120.4
  }
};

let route = [];
let lastCalculation = null;


// 1. Calculate distance between two coordinates.

function calculateDistance(pointA, pointB) {

  const earthRadius = 6371;

  const toRadians = degrees =>
    degrees * Math.PI / 180;

  const latDifference =
    toRadians(pointB.lat - pointA.lat);

  const lonDifference =
    toRadians(pointB.lon - pointA.lon);

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(pointA.lat)) *
    Math.cos(toRadians(pointB.lat)) *
    Math.sin(lonDifference / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// 2. Add destinations to the route.

function addWaypoint() {

  const select =
    document.getElementById("destination-select");

  const destinationId = select.value;

  if (route.length >= 8) {
    alert("Maximum of 8 waypoints allowed.");
    return;
  }

  if (route.includes(destinationId)) {
    alert("This destination is already in your route.");
    return;
  }

  route.push(destinationId);

  renderRoute();
}


// 3. Display the route.

function renderRoute() {

  const container =
    document.getElementById("route-list");

  container.replaceChildren();

  if (route.length === 0) {
    container.textContent = "No waypoints added.";
    return;
  }

  route.forEach((id, index) => {

    const destination = DESTINATIONS[id];

    const stop = document.createElement("div");
    stop.className = "route-stop";

    const name = document.createElement("span");

    name.textContent =
      `${index + 1}. ${destination.name}`;

    const remove = document.createElement("button");

    remove.textContent = "REMOVE";

    remove.addEventListener("click", () => {

      route.splice(index, 1);

      renderRoute();

    });

    stop.append(name, remove);

    container.appendChild(stop);

  });
}


// 4. Calculate the complete mission.

function calculateMission() {

  const callsign =
    document.getElementById("ship-name").value.trim();

  const speed = Number(
    document.getElementById("ship-speed").value
  );

  const availableFuel = Number(
    document.getElementById("ship-fuel").value
  );

  if (!callsign || !Number.isFinite(speed) ||
      !Number.isFinite(availableFuel) ||
      speed <= 0 || availableFuel < 0) {

    alert("Enter a valid callsign, speed and fuel amount.");
    return;
  }

  if (route.length === 0) {
    alert("Add at least one destination.");
    return;
  }

  let totalDistance = 0;

  let previous = ORIGIN;

  route.forEach(id => {

    const destination = DESTINATIONS[id];

    totalDistance += calculateDistance(
      previous,
      destination
    );

    previous = destination;

  });

  // Fuel consumption model:
  // 2.4 units per 1,000 km.

  const baseFuel =
    (totalDistance / 1000) * 2.4;

  // Add 20% emergency reserve.

  const requiredFuel = baseFuel * 1.2;

  const travelHours = totalDistance / speed;

  const fuelRemaining =
    availableFuel - requiredFuel;

  const ready =
    availableFuel >= requiredFuel;

  lastCalculation = {
    callsign,
    speed,
    availableFuel,
    requiredFuel,
    totalDistance,
    travelHours,
    ready,
    route: [...route]
  };

  displayResults(lastCalculation);

}


// 5. Display mission analysis.

function displayResults(data) {

  const results =
    document.getElementById("mission-results");

  const verdict =
    document.getElementById("mission-verdict");

  results.replaceChildren();

  const metrics = [
    ["SPACECRAFT", data.callsign],
    ["TOTAL DISTANCE",
      data.totalDistance.toFixed(1) + " km"],
    ["ESTIMATED TRAVEL TIME",
      data.travelHours.toFixed(2) + " hours"],
    ["FUEL REQUIRED",
      data.requiredFuel.toFixed(2) + " units"],
    ["FUEL REMAINING",
      (data.availableFuel -
        data.requiredFuel).toFixed(2) + " units"]
  ];

  metrics.forEach(([label, value]) => {

    const card = document.createElement("div");

    card.className = "mission-metric";

    const heading = document.createElement("span");
    heading.textContent = label;

    const number = document.createElement("strong");
    number.textContent = value;

    card.append(heading, number);

    results.appendChild(card);

  });

  verdict.classList.toggle("unsafe", !data.ready);

  verdict.textContent = data.ready
    ? "LAUNCH AUTHORISED — FUEL REQUIREMENTS MET"
    : "LAUNCH DENIED — INSUFFICIENT FUEL";

}


// 6. Save missions to browser storage.

function saveMission() {

  if (!lastCalculation) {
    alert("Calculate a mission before saving.");
    return;
  }

  const saved = JSON.parse(
    localStorage.getItem("aeroMissions") || "[]"
  );

  const mission = {
    ...lastCalculation,
    id: Date.now(),
    savedAt: new Date().toISOString()
  };

  saved.push(mission);

  localStorage.setItem(
    "aeroMissions",
    JSON.stringify(saved)
  );

  refreshSavedMissions();

  alert("Mission successfully saved.");

}


// 7. Populate saved missions.

function refreshSavedMissions() {

  const select =
    document.getElementById("saved-missions");

  select.replaceChildren();

  const placeholder = document.createElement("option");

  placeholder.value = "";
  placeholder.textContent = "Select a saved mission";

  select.appendChild(placeholder);

  const saved = JSON.parse(
    localStorage.getItem("aeroMissions") || "[]"
  );

  saved.forEach(mission => {

    const option = document.createElement("option");

    option.value = mission.id;

    option.textContent =
      `${mission.callsign} — ${new Date(
        mission.savedAt
      ).toLocaleString()}`;

    select.appendChild(option);

  });

}


// 8. Load an existing mission.

function loadMission() {

  const id =
    document.getElementById("saved-missions").value;

  if (!id) {
    alert("Select a saved mission first.");
    return;
  }

  const saved = JSON.parse(
    localStorage.getItem("aeroMissions") || "[]"
  );

  const mission = saved.find(
    item => String(item.id) === id
  );

  if (!mission) {
    alert("Mission could not be found.");
    return;
  }

  route = [...mission.route];

  document.getElementById("ship-name").value =
    mission.callsign;

  document.getElementById("ship-speed").value =
    mission.speed;

  document.getElementById("ship-fuel").value =
    mission.availableFuel;

  renderRoute();

  calculateMission();

}


// 9. Connect the interface.

document
  .getElementById("add-destination")
  .addEventListener("click", addWaypoint);

document
  .getElementById("calculate-mission")
  .addEventListener("click", calculateMission);

document
  .getElementById("save-mission")
  .addEventListener("click", saveMission);

document
  .getElementById("load-mission")
  .addEventListener("click", loadMission);


// Initialise the system.

renderRoute();
refreshSavedMissions();

console.log("AERØ/NOVA Mission Planner online.");
