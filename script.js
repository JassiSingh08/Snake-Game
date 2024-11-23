
// Load images
const snakeHeadImg = new Image();
const foodSprite = new Image();
const snakeBodyImg = new Image();
const gameOverSnakeHead = new Image();
snakeHeadImg.src = "./assets/sprites/snake_green_head_64.png";
foodSprite.src = "./assets/sprites/apple_red_64.png";
snakeBodyImg.src = "./assets/sprites/snake_green_blob_64.png";
gameOverSnakeHead.src = "./assets/sprites/snake_green_xx.png";

//Load Audio
const GamePlayAudio = new Audio("./music/gameplay.mp3");
const GameOverAudio = new Audio("./music/gameover.mp3");
const GameOverAudio2 = new Audio("./music/error.mp3");
const foodEatenAudio = new Audio("./music/food.mp3");
//point.mp3 will be used for Bonus Food

// Global flags and variables
let highScore = 0;
let animationID;
let gameStarted = false;
let gamePaused = false;

const highscorebox = document.getElementById('highscorebox');

//Modal Variables
const modal = document.getElementById('myModal');
const ModalHeading = document.getElementById('GameOverHeading');
const GameOverText = document.getElementById('GameOverText');
const CloseModalBtn = document.getElementById('CloseModalBtn');

//Audio UI variables
const muteDiv = document.querySelector('.mute');
const voiceDiv = document.querySelector('.voice');
const muteAudioCheckbox = document.getElementById('muteAudioCheckbox');

//Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    //Load Audio Setting
    const isAudioMuted = localStorage.getItem("isAudioMuted") === "true";
    toggleAudioState(isAudioMuted);
    if (!isAudioMuted) muteAudioCheckbox.checked = true

    // Load Highscore if any
    let highScore = localStorage.getItem("highScore") ?? 0;
    highscorebox.innerHTML = "High Score: " + highScore;

    //Show Start Modal
    Modal(
        "Start Game",
        `Press Play to start the game!`,
        "Play",
        "flex",
        () => {
            modal.style.display = "none";
        }
    );

    //Send Event to Native
    sendMessageToWebView({ type: "DOM_READY" });
});

muteAudioCheckbox.addEventListener('change', function () {
    localStorage.setItem("isAudioMuted", !this.checked)
    toggleAudioState(!this.checked);
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
        const heightRatio = 1.5;
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
    if (checkCollision(newHead, snakePositions)) {
        snakeHeadImg.src = gameOverSnakeHead.src;
        GameOverAudio2.play();
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
        foodEatenAudio.play();
        navigator.vibrate(150);
        score += 1;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            highscorebox.innerHTML = "High Score: " + highScore;
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