const allAudio = [GamePlayAudio, GameOverAudio, GameOverAudio2, foodEatenAudio, SnakeMoveAudio];

function toggleAudioState(isAudioMuted) {
    if (isAudioMuted) {
        muteDiv.style.display = 'block';
        voiceDiv.style.display = 'none';
        pauseAllAudio();
    }
    else {
        muteDiv.style.display = 'none';
        voiceDiv.style.display = 'block';
        GamePlayAudio.play();
        GamePlayAudio.loop = true;
    }
}


const pauseAllAudio = () => allAudio.forEach(audio => { audio.pause(); audio.currentTime = 0 });

const resumeAllAudio = () => {
    const isAudioMuted = localStorage.getItem("isAudioMuted") === "true";
    muteAudioCheckbox.checked = isAudioMuted;
    toggleAudioState(isAudioMuted);
    if (!isAudioMuted) {
        allAudio
            .filter((audio) => audio !== GamePlayAudio)
            .forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });
    }
};
