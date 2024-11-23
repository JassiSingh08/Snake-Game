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

function checkCollision(head, snakePositions) {
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


function setItemLifespan(itemType, lifespan, warningCallback, removeCallback) {
    const warningTime = 1000;
    // Warning before the item disappears
    setTimeout(() => {
        warningCallback();
    }, lifespan - warningTime);

    // Remove the item after its lifespan
    setTimeout(() => {
        removeCallback();
    }, lifespan);
}

function toggleAudioState(isAudioMuted) {
    if (isAudioMuted) {
        muteDiv.style.display = 'block';
        voiceDiv.style.display = 'none';
        GamePlayAudio.pause();
        GamePlayAudio.currentTime = 0;
    }
    else {
        muteDiv.style.display = 'none';
        voiceDiv.style.display = 'block';
        GamePlayAudio.play();
        GamePlayAudio.loop = true;
    }
}