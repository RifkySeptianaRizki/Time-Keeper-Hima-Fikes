// Ambil elemen dari HTML
const qaTimerEl = document.getElementById('qa-timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const skipThirtySecondsBtn = document.getElementById('skip-thirty-seconds');
const skipTenSecondsBtn = document.getElementById('skip-ten-seconds');

// --- BAGIAN AUDIO ---
const beep1 = new Audio('beep_1.mp3');
const beep2 = new Audio('beep_2.mp3');
const countdown321 = new Audio('321.mp3');
const endAlert = new Audio('end_alert.mp3');
const startSound = new Audio('start.mp3');

// --- FUNGSI HELPER ---
function playSoundMultipleTimes(audioObject, count) {
    let played = 0;
    const soundInterval = setInterval(() => {
        if (played < count) {
            audioObject.currentTime = 0;
            audioObject.play();
            played++;
        } else {
            clearInterval(soundInterval);
        }
    }, 600); // Jeda antar beep
}

// --- WAKTU AWAL ---
const INITIAL_TIME = 2 * 60; // 2 menit
let currentTime = INITIAL_TIME;
let timerInterval = null;

// --- FUNGSI ---
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    qaTimerEl.textContent = formatTime(currentTime);
}

function skipQaTime(secondsToSkip) {
    if (currentTime > 0) {
        currentTime = Math.max(0, currentTime - secondsToSkip);
        updateDisplay();
    }
}

function startTimer() {
    if (timerInterval !== null) return;
    startSound.currentTime = 0;
    startSound.play();

    timerInterval = setInterval(() => {
        // Peringatan suara yang sudah disesuaikan
        if (currentTime === 90) beep1.play();                      // 1:30 -> 1 kali beep
        if (currentTime === 60) playSoundMultipleTimes(beep1, 2);  // 1:00 -> 2 kali beep
        if (currentTime === 30) playSoundMultipleTimes(beep1, 3);  // 0:30 -> 3 kali beep
        if (currentTime === 10) beep2.play();                      // 0:10 -> 1 kali beep (suara beda)
        if (currentTime === 3) countdown321.play();

        if (currentTime > 0) {
            currentTime--;
            updateDisplay();
        } else {
            endAlert.play();
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    currentTime = INITIAL_TIME;
    updateDisplay();
}

// --- EVENT LISTENER ---
window.onload = updateDisplay;
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
skipThirtySecondsBtn.addEventListener('click', () => skipQaTime(30));
skipTenSecondsBtn.addEventListener('click', () => skipQaTime(10));

// KONTROL KEYBOARD
window.addEventListener('keydown', function(event) {
    if ([' ', 'r', 'R', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
    
    switch (event.key) {
        case ' ':
            if (timerInterval === null) {
                startTimer();
            } else {
                pauseTimer();
            }
            break;
        case 'r':
        case 'R':
            resetTimer();
            break;
        case 'ArrowLeft':
            skipQaTime(10);
            break;
        case 'ArrowRight':
            skipQaTime(30);
            break;
    }
});