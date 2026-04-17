const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

// Modal Elements
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const nicknameInput = document.getElementById('nickname');
const submitScoreBtn = document.getElementById('submit-score-btn');
const restartBtn = document.getElementById('restart-btn');

// Start Screen Elements
const startScreen = document.getElementById('start-screen');
const startGameBtn = document.getElementById('start-game-btn');

const API_URL = 'http://localhost:3000/scores';

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let gameLoopInterval;

// --- API FUNCTIONS ---

async function fetchLeaderboard() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const scores = await response.json();
        renderLeaderboard(scores);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardList.innerHTML = '<li>Error loading scores</li>';
    }
}

async function submitScore(nickname, finalScore) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, score: finalScore }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        await fetchLeaderboard();
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

async function deleteScore(id) {
    if (!confirm('Are you sure you want to delete this score?')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Network response was not ok');
        await fetchLeaderboard();
    } catch (error) {
        console.error('Error deleting score:', error);
    }
}

function renderLeaderboard(scores) {
    if (scores.length === 0) {
        leaderboardList.innerHTML = '<li>No scores yet!</li>';
        return;
    }
    
    leaderboardList.innerHTML = '';
    scores.forEach((s, index) => {
        const li = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'leaderboard-name';
        nameSpan.textContent = `${index + 1}. ${s.nickname}`;
        
        const rightContainer = document.createElement('div');
        rightContainer.className = 'leaderboard-right';

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'leaderboard-score';
        scoreSpan.textContent = s.score;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete Score';
        deleteBtn.onclick = () => deleteScore(s.id);
        
        rightContainer.appendChild(scoreSpan);
        rightContainer.appendChild(deleteBtn);

        li.appendChild(nameSpan);
        li.appendChild(rightContainer);
        leaderboardList.appendChild(li);
    });
}

// --- MODAL LOGIC ---

function showGameOverModal() {
    finalScoreElement.textContent = score;
    gameOverModal.classList.remove('hidden');
    nicknameInput.focus();
}

function hideModal() {
    gameOverModal.classList.add('hidden');
    nicknameInput.value = '';
}

submitScoreBtn.addEventListener('click', async () => {
    const nickname = nicknameInput.value.trim();
    if (nickname) {
        submitScoreBtn.disabled = true;
        await submitScore(nickname, score);
        submitScoreBtn.disabled = false;
        resetToMainScreen();
    } else {
        alert('Please enter a nickname!');
        nicknameInput.focus();
    }
});

restartBtn.addEventListener('click', () => {
    resetToMainScreen();
});

function resetToMainScreen() {
    hideModal();
    gameBoard.innerHTML = '';
    score = 0;
    scoreElement.textContent = score;
    startScreen.classList.remove('hidden');
}

// --- GAME LOGIC ---

function draw() {
    gameBoard.innerHTML = '';
    drawSnake();
    drawFood();
}

function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake-segment');
        gameBoard.appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function update() {
    if (gameOver) {
        return;
    }

    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (isCollision(head)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

function generateFood() {
    food.x = Math.floor(Math.random() * gridSize) + 1;
    food.y = Math.floor(Math.random() * gridSize) + 1;
}

function isCollision(head) {
    if (
        head.x < 1 ||
        head.x > gridSize ||
        head.y < 1 ||
        head.y > gridSize
    ) {
        return true; // Wall collision
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Self collision
        }
    }

    return false;
}

function handleKeyPress(event) {
    const key = event.key;
    switch (key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    hideModal();
    generateFood();
    
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(update, 200);
    document.addEventListener('keydown', handleKeyPress);
}

function endGame() {
    gameOver = true;
    clearInterval(gameLoopInterval);
    document.removeEventListener('keydown', handleKeyPress);
    showGameOverModal();
}

// --- START / INIT LOGIC ---

startGameBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    startGame();
});

// Initial fetch and setup
fetchLeaderboard();
// Do not start game immediately, wait for user to click Start

