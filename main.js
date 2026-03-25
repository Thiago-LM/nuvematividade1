const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let gameLoopInterval;

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
    generateFood();
    gameLoopInterval = setInterval(update, 200);
    document.addEventListener('keydown', handleKeyPress);
}

function endGame() {
    gameOver = true;
    clearInterval(gameLoopInterval);
    alert(`Game Over! Your score: ${score}`);
}

startGame();
