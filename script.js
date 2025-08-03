// Ambil elemen dari HTML
const mainTimerEl = document.getElementById('main-timer');
const interruptTimerEl = document.getElementById('interrupt-timer');
const startMainBtn = document.getElementById('start-main');
const pauseAllBtn = document.getElementById('pause-all');
const startInterruptBtn = document.getElementById('start-interrupt');
const resetAllBtn = document.getElementById('reset-all');
const skipMinuteBtn = document.getElementById('skip-minute');
const skipTenSecondsBtn = document.getElementById('skip-ten-seconds');

// --- BAGIAN AUDIO ---
const beep1 = new Audio('beep_1.mp3');
const beep2 = new Audio('beep_2.mp3');
const countdown321 = new Audio('321.mp3');
const endAlert = new Audio('end_alert.mp3');
const startSound = new Audio('start.mp3');

// --- WAKTU AWAL ---
const INITIAL_MAIN_TIME = 5 * 60;
const INITIAL_INTERRUPT_TIME = 15;

let mainTime = INITIAL_MAIN_TIME;
let interruptTime = INITIAL_INTERRUPT_TIME;

let mainInterval = null;
let interruptInterval = null;

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
    }, 600);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    mainTimerEl.textContent = formatTime(mainTime);
    interruptTimerEl.textContent = formatTime(interruptTime);
}

function skipMainTime(secondsToSkip) {
    if (mainTime > 0) {
        mainTime = Math.max(0, mainTime - secondsToSkip);
        updateDisplay();
    }
}

// --- FUNGSI KONTROL TIMER UTAMA ---
function startMainTimer() {
    if (interruptInterval !== null) {
        clearInterval(interruptInterval);
        interruptInterval = null;
    }
    if (mainInterval !== null) return;

    startSound.currentTime = 0;
    startSound.play();

    mainInterval = setInterval(() => {
        if (mainTime === 4 * 60) beep1.play();
        if (mainTime === 3 * 60) playSoundMultipleTimes(beep1, 2);
        if (mainTime === 1 * 60) beep2.play();
        if (mainTime === 3) countdown321.play();

        if (mainTime > 0) {
            mainTime--;
            updateDisplay();
        } else {
            endAlert.play();
            clearInterval(mainInterval);
            mainInterval = null;
        }
    }, 1000);
}

// --- FUNGSI KONTROL TIMER INTERUPSI ---
function startInterruptTimer() {
    if (mainInterval === null && mainTime === INITIAL_MAIN_TIME) return;

    clearInterval(mainInterval);
    mainInterval = null;

    startSound.currentTime = 0;
    startSound.play();

    interruptTime = INITIAL_INTERRUPT_TIME;
    updateDisplay();

    interruptInterval = setInterval(() => {
        if (interruptTime === 3) countdown321.play();

        if (interruptTime > 0) {
            interruptTime--;
            updateDisplay();
        } else {
            clearInterval(interruptInterval);
            interruptInterval = null;
            if(mainTime > 0) startMainTimer();
        }
    }, 1000);
}

function pauseAllTimers() {
    clearInterval(mainInterval);
    clearInterval(interruptInterval);
    mainInterval = null;
    interruptInterval = null;
}

function resetAllTimers() {
    pauseAllTimers();
    mainTime = INITIAL_MAIN_TIME;
    interruptTime = INITIAL_INTERRUPT_TIME;
    updateDisplay();
}

window.onload = updateDisplay;

// --- EVENT LISTENER UNTUK TOMBOL KLIK ---
startMainBtn.addEventListener('click', startMainTimer);
pauseAllBtn.addEventListener('click', pauseAllTimers);
startInterruptBtn.addEventListener('click', startInterruptTimer);
resetAllBtn.addEventListener('click', resetAllTimers);
skipMinuteBtn.addEventListener('click', () => skipMainTime(60));
skipTenSecondsBtn.addEventListener('click', () => skipMainTime(10));

// KONTROL KEYBOARD
window.addEventListener('keydown', function(event) {
    if ([' ', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
    switch (event.key) {
        case ' ':
            if (mainInterval === null && interruptInterval === null) {
                startMainTimer();
            } else {
                pauseAllTimers();
            }
            break;
        case 'Enter':
            startInterruptTimer();
            break;
        case 'r':
        case 'R':
            resetAllTimers();
            break;
        case 'ArrowLeft':
            skipMainTime(10);
            break;
        case 'ArrowRight':
            skipMainTime(60);
            break;
    }
});