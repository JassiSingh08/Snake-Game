const SnakeMoveAudio = new Audio("./music/move.mp3");

const options = {
    zone: document.getElementById("joystick"),
    mode: "static",
    position: { left: "50%", top: "10%" },
    color: "#008000",
    restJoystick: true,
    size: 150,
    dynamicPage: true,
};
const manager = nipplejs.create(options);

window.addEventListener("keydown", (e) => {
    SnakeMoveAudio.play();
    switch (e.key) {
        case "ArrowUp":
            // if (direction.y === 0)
            direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            // if (direction.y === 0)
            direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            // if (direction.x === 0)
            direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            // if (direction.x === 0)
            direction = { x: 1, y: 0 };
            break;
    }
});

manager.on("move", (evt, data) => {
    SnakeMoveAudio.play();
    if (data.direction)
        switch (data.direction.angle) {
            case "up":
                // if (direction.y === 0) 
                direction = { x: 0, y: -1 };
                break;
            case "down":
                // if (direction.y === 0) 
                direction = { x: 0, y: 1 };
                break;
            case "left":
                // if (direction.x === 0) 
                direction = { x: -1, y: 0 };
                break;
            case "right":
                // if (direction.x === 0) 
                direction = { x: 1, y: 0 };
                break;
            default:
                break;
        }
});

manager.on("end", () => {
    SnakeMoveAudio.pause();
    console.log("Stop");
});
