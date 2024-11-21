function sendMessageToWebView(message) {
    console.log(JSON.stringify(message))
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
}

function isCollide(snake) {
    // if you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // if you bump into the wall
    if (snake[0].x >= 20 || snake[0].x <= 0 || snake[0].y >= 20 || snake[0].y <= 0) {
        return true;
    }

}