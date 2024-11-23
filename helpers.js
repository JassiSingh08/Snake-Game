const Modal = (heading, subText, buttonText, display, onclick = () => { }) => {
    ModalHeading.innerText = heading;
    GameOverText.innerText = subText;
    CloseModalBtn.innerText = buttonText;
    modal.style.display = display;
    CloseModalBtn.onclick = onclick;
};

function sendMessageToWebView(message) {
    console.log(JSON.stringify(message))
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
}

function getRandomPosition(max, boxSize) {
    return Math.floor(Math.random() * (max / boxSize)) * boxSize;
}

function generateFoodPosition(snake) {
    let position;
    do {
        position = {
            x: getRandomPosition(canvas.width, boxSize),
            y: getRandomPosition(canvas.height, boxSize),
        };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
}
