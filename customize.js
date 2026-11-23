/*
 * YOUR THREE VIBES WORKSHOP CUSTOMISATIONS
 * Make these edits yourself. Save the file and refresh the website.
 * 1) Rename your planet and change its atmosphere accent.
 * 2) Add your own spacecraft to STARTER_FLIGHTS.
 * 3) Create a new incident in STARTER_ALERTS.
 */

const PLANET_CONFIG = {
  // CHANGE 1: Try a name such as "KEPLER-186F" or invent your own world.
  name: "NOVA-9",
  sector: "Sector 07 · Outer Rim",
  // Change this to a CSS colour, e.g. "#a78bfa" (violet).
  accent: "#67d9e8"
};

// CHANGE 2: Add a new object to this array. Keep the commas and quotation marks.
const STARTER_FLIGHTS = [
  { callsign: "NOVA 104", destination: "Olympus Port", type: "Civilian", altitude: 12400, velocity: 840, status: "On course", angle: 18, radius: 0.70 },
  { callsign: "AXIOM 208", destination: "Lunar Gate", type: "Cargo", altitude: 18200, velocity: 620, status: "Delayed", angle: 72, radius: 0.55 },
  { callsign: "STAR 032", destination: "Titan Base", type: "Exploration", altitude: 24600, velocity: 1120, status: "On course", angle: 126, radius: 0.82 },
  { callsign: "ORBIT 501", destination: "Zenith City", type: "Civilian", altitude: 9800, velocity: 760, status: "Emergency", angle: 170, radius: 0.62 },
  { callsign: "PULSE 019", destination: "New Eden", type: "Civilian", altitude: 15600, velocity: 910, status: "Approaching", angle: 218, radius: 0.76 },
  { callsign: "CARGO 77", destination: "Kepler Station", type: "Cargo", altitude: 20100, velocity: 540, status: "On course", angle: 260, radius: 0.48 },
  { callsign: "HELIOS 6", destination: "Olympus Port", type: "Exploration", altitude: 28900, velocity: 1340, status: "On course", angle: 304, radius: 0.88 },
  { callsign: "NOVA 220", destination: "Zenith City", type: "Civilian", altitude: 11200, velocity: 790, status: "Approaching", angle: 342, radius: 0.58 }
];

// CHANGE 3: Add a new alert object to this array.
const STARTER_ALERTS = [
  { id: 1, title: "Cryo-dust front detected", location: "Olympus corridor · Sector 03", severity: "warning", time: "2 MIN AGO", acknowledged: false },
  { id: 2, title: "Unscheduled signal received", location: "Deep-space relay · Grid 118", severity: "critical", time: "6 MIN AGO", acknowledged: false }
];
