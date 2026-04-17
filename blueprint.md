# Snake Game with Leaderboard

## Overview

A modern web application featuring a classic snake game with a persistent global leaderboard. The project is separated into a `frontend` single-page application and a `backend` Node.js REST API.

## Features

*   **Classic Gameplay:** Control a snake, eat food, and grow longer without hitting the walls or yourself.
*   **Leaderboard:** View top 10 global high scores persistently stored on the server.
*   **Nickname Submission:** Submit your nickname upon game over to claim your spot on the leaderboard.
*   **Modern UI/UX:** Styled with clean typography, dynamic color gradients, glowing shadows, noise textures, and modal overlays for seamless interactions.

## Architecture & Design

*   **Frontend (/frontend):** 
    *   `index.html`: Responsive layout utilizing Flexbox and Grid. Contains a game container, a leaderboard aside pane, and a hidden modal overlay for submitting scores.
    *   `style.css`: Uses modern CSS variables, CSS grid/flex, animations (pulse effects), advanced background SVGs (noise texture), and layered shadows for a premium layered feel.
    *   `main.js`: Vanilla JavaScript handling the snake game loop, handling the keyboard input natively, fetching the top 10 leaderboard scores initially, and posting new records on "Game Over".
*   **Backend (/backend):**
    *   `index.js`: An Express server featuring standard CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE` over `/scores`).
    *   `scores.json`: A simple file-based JSON store replacing a standard DB for lightweight storage of the simple `{ id, nickname, score, timestamp }` constructs.

## Current Plan

1.  ~~**Reorganize Folders**~~: Separate files correctly into `/frontend` and `/backend` directories.
2.  ~~**Implement Backend**~~: Add reading/writing endpoints to `backend/index.js` over `scores.json`.
3.  ~~**Update Frontend Elements**~~: Refactor `index.html` and `style.css` matching modern design requirements (clean typography, glowing elements).
4.  ~~**Update Game Logic**~~: Ensure game ends smoothly into a form modal instead of `alert()`, posting the score correctly to the backend upon validation.
