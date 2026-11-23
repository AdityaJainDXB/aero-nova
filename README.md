# AERØ/NOVA — Planetary Mission Control

AERØ/NOVA is a browser-based, fictional air-traffic-control dashboard for a human settlement on the exoplanet NOVA-9. It puts the visitor in the flight director's chair, monitoring spacecraft, planetary conditions and incident reports.

> **Simulation notice:** All flights, spacecraft, alerts, readings and locations are fictional demo data. This is not a real aviation or spacecraft tracking service.

## Features

- Animated canvas radar with moving spacecraft contacts and category filters.
- Flight manifest with search and status filtering.
- Register new flights through a working form.
- Incident reporting, severity levels and acknowledgement controls.
- Live UTC clock and simulated traffic updates.
- Responsive layout for desktop, tablet and mobile.
- No build tools, API keys, database or installation required.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local development server, run this in the project directory:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## The three personal Vibes edits

Open `customize.js`. The three tasks are marked in the file:

1. **Planet identity:** change `PLANET_CONFIG.name`, `sector` and `accent`.
2. **Your spacecraft:** add another object to `STARTER_FLIGHTS`, giving it a callsign, destination, type, altitude, velocity, status, angle and radius.
3. **Your incident:** add another object to `STARTER_ALERTS` with a unique `id`, title, location, severity, time and `acknowledged: false`.

Save the file and refresh the browser to see your edits.

## Project structure

```text
aero-nova/
├── index.html       # Dashboard layout and dialogs
├── style.css        # Visual design and responsive layout
├── customize.js    # Three clearly marked personal edits
├── script.js        # Radar, flight table, forms and interactions
├── assets/          # Optional assets you add
└── README.md
```

## Git workflow

Make commits as you complete real milestones. For example:

```bash
git add index.html style.css
git commit -m "Build mission control dashboard layout"

git add script.js
git commit -m "Add interactive radar and flight manifest"

git add customize.js
git commit -m "Add editable planet and simulation data"

git add README.md
git commit -m "Document setup and personalisation tasks"
```

Do not create commits for work you have not actually done. A useful commit records a real, understandable change.

## Deploy with GitHub Pages

1. Create a **public** GitHub repository named `aero-nova`.
2. Push the project files to the `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site.

Your site will be available at `https://YOUR-USERNAME.github.io/aero-nova/`.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas 2D API
- Git and GitHub Pages

## Learning notes

The radar is drawn with the browser's Canvas 2D API. Flight and alert information is stored in JavaScript arrays for this self-contained demo. Form submissions update the page in memory; refreshing restores the starter data. No real-world flight data is requested or transmitted.

## Credits

Created as a personal project for the Hack Club Vibes workshop. The concept, fictional world and simulation data are original to this project.
