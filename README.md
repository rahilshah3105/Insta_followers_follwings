# InstaMint 🔍 | Instagram Connections Analyzer & Unfollower Tracker

[![React Version](https://img.shields.io/badge/React-v18.3-blue.svg)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-v6.0-purple.svg)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

InstaMint is a highly secure, client-side web application designed to help users analyze their Instagram connections, track non-reciprocal relationships (who doesn't follow you back, and who you don't follow back), view pending requests, search logs, and activity. 

Built with privacy at its core, **all data is processed entirely in the user's browser—no data is uploaded to external servers.**

---

## 💡 The Problem It Solves

Third-party Instagram analyzer apps are notoriously unsafe. They frequently require users to input their Instagram credentials (username and password) directly, risking account suspension, hacking, or data breaches. 

**InstaMint solves this security issue by:**
1. Eliminating the need for passwords or account log-ins.
2. Utilizing Instagram's official data exports (JSON format).
3. Parsing and comparing files entirely client-side using JavaScript, keeping personal data 100% private.

---

## ✨ Key Features

* **Instant Unfollower Tracking**: View a clean list of people who do not follow you back.
* **Mutual & Fans Analysis**: Easily see your mutual connections and fans (people who follow you but you do not follow back).
* **Extended Insights**: View pending follow requests, blocked users, search history logs, and login activity.
* **Super-Fast Directory Ingestion**: Simply drag and drop your unzipped Instagram export folder directly into the browser.
* **Premium UX/UI**: Beautiful modern design system featuring glassmorphic panels, smooth micro-animations, theme toggles, and responsive grid layouts.
* **Instant Filtering & Searching**: Instantly find usernames, IPs, or agents across all tables with real-time global search.
* **Responsive Layout**: Designed for seamless desktop, tablet, and mobile user experiences.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React (v18.3.1)
* **Build Tool**: Vite (v6.0.5)
* **Styling & Theme**: Vanilla CSS (Premium Glassmorphic Design System) & Bootstrap 5
* **State & Performance**: React hooks with browser-based `localStorage` caching and optimized event loop yielding
* **Icons**: React Icons (FaIcon library)

---

## 📥 How to Get Your Instagram Data

1. Open the **Instagram** app on your phone or visit [Instagram Web](https://www.instagram.com/).
2. Navigate to: **Account Center** &rarr; **Your Information and Permissions** &rarr; **Download Your Information**.
3. Select **"Some of your information"** and choose only **"Followers and following"** (this generates the file in minutes rather than hours/days).
4. Select Format: **JSON**, Media Quality: **Low** (to minimize download size), and click **Create Files**.
5. Once your data is ready, download and unzip the zip archive to your device.
6. Open InstaMint and drag-and-drop the unzipped `followers_and_following` folder directly onto the screen.

---

## 🚀 Installation & Local Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahilshah3105/Insta_followers_follwings.git
   cd Insta_followers_follwings
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the browser:**
   Navigate to the local address displayed in your terminal (usually `http://localhost:5173`).

---

## 📸 Screenshots

| Light Mode Dashboard | Dark Mode Dashboard |
|---|---|
| *[Placeholder: Add Light Mode Screenshot]* | *[Placeholder: Add Dark Mode Screenshot]* |

| Drag & Drop Uploader | Analysis & Connections Table |
|---|---|
| *[Placeholder: Add Uploader Screenshot]* | *[Placeholder: Add Table View Screenshot]* |

---

## 🔮 Future Improvements

* [ ] **Data Visualizations**: Add interactive pie/bar charts summarizing followers vs. following ratios over time.
* [ ] **Offline PWA Support**: Enable Progressive Web App capabilities for complete offline operation.
* [ ] **Extended Data Parsing**: Add support for other parts of the Instagram export like likes, comments, and direct message statistics.
* [ ] **Automated PDF Report Generation**: Export unfollower reports with one click.

---

## 👥 Author

Created by **[Rahil Shah](https://github.com/rahilshah3105)** (rahilshah3105)

If you found this tool helpful, feel free to star the repository ⭐ or reach out!
