# Snake Game & Leaderboard 🐍

A modern web application featuring a classic snake game with a persistent global leaderboard. 

## Project Structure
This repository is split into two distinct sections:
- **/frontend** - The browser client (HTML, CSS, regular JavaScript) handling the game and UI.
- **/backend** - A Node.js Express server acting as the REST API to save and retrieve scores dynamically.

---

## How to Run

Because this project uses a backend to track scores, you need to run **both** the backend API and the frontend client simultaneously.

### Step 1: Start the Backend API
The backend handles saving your nicknames/scores to `scores.json` and runs a local Express API.

Open a terminal and run the following commands:
```bash
cd backend
npm install
node index.js
```
*The server will start and show `Servidor rodando em http://localhost:3000`. Leave this terminal session running.*

### Step 2: Start the Frontend Client
The frontend consists of static files. 

**Option A: Extension / Built-in Preview**
If you are using Firebase Studio / Project IDX, or have a "Live Server" extension, simply use it to open `frontend/index.html`.

**Option B: Terminal (Simple Web Server)**
Open a **new** terminal tab, ensure you are in the root `nuvematividade1` directory, and use a lightweight static server:
```bash
npx serve frontend
```
*Then visit the `http://localhost:3001` (or whichever port it specifies) in your web browser!*

> **⚠️ Important Note:** Do not try to run `npm run ./frontend/index.html` as the frontend is not a node module. Furthermore, do not open the HTML file directly on your computer (like `file:///Users/thiago/.../index.html`), because modern browsers block API requests made from `file://` URLs. Please use the local web server options above!