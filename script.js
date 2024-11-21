// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('/music/food.mp3');
const gameOverSound = new Audio('/music/gameover.mp3');
const moveSound = new Audio('/music/move.mp3');
const musicSound = new Audio('/music/music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]
let food = {
    x: 6, y: 7,
    // emoji: ['🍎', '🍌', '🍇', '🍒', '🍉'][Math.floor(Math.random() * 5)]
};
var hiscoreval = 0;

document.addEventListener('DOMContentLoaded', function () {
    sendMessageToWebView({ type: "DOM_READY" });
});

//variables for onscreen buttons
let up = document.getElementById('b1');
let down = document.getElementById('b2');
let left = document.getElementById('b3');
let right = document.getElementById('b4');
let touch = document.getElementById('OnScreenButtons')

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main)
    console.time(ctime)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        // musicSound.pause();
        // gameOverSound.play();
        // window.location.reload();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Your Score is " + score + ". Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        dispspeed.innerHTML = "Speed : " + speed;
        score = 0;
        scorebox.innerHTML = "Score: " + score;
        sendMessageToWebView({ type: "GAME_OVER" });
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            highscorebox.innerHTML = "High Score: " + hiscoreval;
        }
        if (score % 20 === 0 && speed < 40) {
            speed += 4;
        }
        scorebox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
            // emoji: ['🍎', '🍌', '🍇', '🍒', '🍉'][Math.floor(Math.random() * 5)]
        };
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    // foodElement.textContent = food.emoji;
    board.appendChild(foodElement);
}

// MAIN LOGIC

musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    highscorebox.innerHTML = "High Score: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: -1 } // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }

});

const options = {
    zone: document.getElementById("joystick"),
    mode: "static",
    position: { left: "50%", top: "50%" },
    color: "#008000",
    restJoystick: true,
    size: 150
};

const manager = nipplejs.create(options);

manager.on("move", (evt, data) => {
    inputDir = { x: 0, y: -1 }
    switch (data.direction.angle) {
        case "up":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "down":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "left":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "right":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

manager.on("end", () => {
    console.log("Stop");
});
