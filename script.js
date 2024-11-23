
// Load images
const snakeHeadImg = new Image();
const foodSprite = new Image();
const snakeBodyImg = new Image();
const gameOverSnakeHead = new Image();
snakeHeadImg.src = "./assets/sprites/snake_green_head_64.png";
foodSprite.src = "./assets/sprites/apple_red_64.png";
snakeBodyImg.src = "./assets/sprites/snake_green_blob_64.png";
gameOverSnakeHead.src = "./assets/sprites/snake_green_xx.png";

// Global flags and variables
let hiscoreval = 0;
let animationID;
let gameStarted = false;
let gamePaused = false;

//Modal Variables
const modal = document.getElementById('myModal');
const ModalHeading = document.getElementById('GameOverHeading');
const GameOverText = document.getElementById('GameOverText');
const CloseModalBtn = document.getElementById('CloseModalBtn');

document.addEventListener('DOMContentLoaded', function () {
    highscorebox.innerHTML = "High Score: " + localStorage.getItem("hiscore");
    Modal(
        "Start Game",
        `Press Play to start the game!`,
        "Play",
        "flex",
        () => {
            modal.style.display = "none";
        }
    );
    sendMessageToWebView({ type: "DOM_READY" });
});


document.addEventListener("message", handleNativeEvent)

// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let canvasWidth = 600;
let canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let snakePositions = new Set();

const boxSize = 20;
let speed = 10;
let direction = { x: 1, y: 0 };
let snake = [{ x: 200, y: 200 }];
let food = generateFoodPosition(snake);
let score = 0;

function resizeCanvas() {
    if (window.innerWidth <= 900) {
        var heightRatio = 1.5;
        canvas.height = canvas.width * heightRatio;
    } else {
        // For desktop
        canvasWidth = 600;
        canvasHeight = 600;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}


window.addEventListener('resize', resizeCanvas);

// Game Loop
let lastRenderTime = 0;
function gameLoop(currentTime) {
    if (!gameStarted) return;
    animationID = window.requestAnimationFrame(gameLoop);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / speed) return;

    lastRenderTime = currentTime;

    update();
    draw();
}

function pauseGame() {
    if (gamePaused) return;
    cancelAnimationFrame(animationID);
    gamePaused = true;
    gameStarted = false;
    Modal(
        "Game Paused!",
        "",
        "Resume",
        "flex",
        () => {
            resumeGame();
        }
    );
}

function resumeGame() {
    if (!gamePaused) return;
    modal.style.display = "none";
    gamePaused = false;
    gameStarted = true;

    animationID = window.requestAnimationFrame(gameLoop);
    sendMessageToWebView({ type: "IS_PLAYING" });
}

function updateSnakePositions() {
    snakePositions.clear();
    snake.forEach(segment => {
        snakePositions.add(`${segment.x},${segment.y}`);
    });
}

function checkCollision(head) {
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        navigator.vibrate(200);
        return true;
    }

    if (snakePositions.has(`${head.x},${head.y}`)) {
        navigator.vibrate(200);
        return true;
    }

    return false;
}

// Game Functions
function update() {
    const newHead = {
        x: snake[0].x + direction.x * boxSize,
        y: snake[0].y + direction.y * boxSize,
    };
    //Warp through WALLS
    // const newHead = {
    //     x: (snake[0].x + direction.x * boxSize + canvas.width) % canvas.width,
    //     y: (snake[0].y + direction.y * boxSize + canvas.height) % canvas.height,
    // };

    // Check for collisions
    if (checkCollision(newHead)) {
        snakeHeadImg.src = gameOverSnakeHead.src;
        cancelAnimationFrame(animationID);
        sendMessageToWebView({ type: "GAME_OVER" });
        Modal(
            "Game Over!",
            `Your Score is ${score}. Press close to play again!`,
            "Again!",
            "flex",
            () => { }
        );
        resetGame();
        return;
    }

    snake.unshift(newHead);

    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        navigator.vibrate(150);
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            highscorebox.innerHTML = "High Score: " + hiscoreval;
        }
        if (score % 15 === 0 && speed < 40) {
            speed += 5;
        }
        scorebox.innerHTML = "Score: " + score;
        food = generateFoodPosition(snake);
    } else {
        snake.pop();
    }
    updateSnakePositions();
}

function draw() {
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, "rgb(170, 236, 170)");
    gradient.addColorStop(1, "rgb(236, 236, 167)");

    // Fill the canvas with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.drawImage(snakeHeadImg, segment.x, segment.y, boxSize, boxSize);
        } else {
            ctx.drawImage(snakeBodyImg, segment.x, segment.y, boxSize, boxSize);
        }
    });

    // Draw the food
    ctx.drawImage(foodSprite, food.x, food.y, boxSize, boxSize);
}

function startGame() {
    if (gameStarted) return;

    // Initialize game state
    snakeHeadImg.src = "./assets/sprites/snake_green_head_64.png";
    snake = [{ x: 200, y: 200 }];
    direction = { x: 1, y: 0 };
    food = generateFoodPosition(snake);
    score = 0;
    snakePositions.clear();

    // Start game
    gameStarted = true;
    gamePaused = false;
    modal.style.display = "none";

    animationID = window.requestAnimationFrame(gameLoop);
    sendMessageToWebView({ type: "IS_PLAYING" });
}

function resetGame() {
    cancelAnimationFrame(animationID);
    gameStarted = false;
    gamePaused = false;
    snakePositions.clear();
    score = 0;
    scorebox.innerHTML = "Score: " + 0;
}

// Modal Button Logic
CloseModalBtn.addEventListener("click", () => {
    navigator.vibrate(200);
    if (!gameStarted && !gamePaused) {
        startGame();
    } else if (gamePaused) {
        resumeGame();
    } else {
        resetGame();
    }
});

resizeCanvas();

function handleNativeEvent(event) {
    const message = event.data;
    if (message.type === "PAUSE_GAME") {
        pauseGame();
    }
}