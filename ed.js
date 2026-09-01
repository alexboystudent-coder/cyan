// --- 2. Állítható Edzésidőzítő Logika ---
    let defaultTime = 90; // Alapértelmezett idő másodpercben (1:30)
    let timeLeft = defaultTime;
    let timerId = null;
    let isRunning = false;

    const timerDisplay = document.getElementById("timer-display");
    const startBtn = document.getElementById("timer-start");
    const resetBtn = document.getElementById("timer-reset");
    const presetBtns = document.querySelectorAll(".preset-btn");

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function beep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 587.33;
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
            console.log("Audio nem engedélyezett");
        }
    }

    // Idő állítása gombokkal (+30s, +1m)
    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const addSeconds = parseInt(btn.getAttribute("data-time"));
            timeLeft += addSeconds;
            defaultTime = timeLeft; // Az új alapértelmezett idő ez lesz
            timerDisplay.textContent = formatTime(timeLeft);
        });
    });

    // Idő állítása kézzel (ha rákattintasz az időre)
    timerDisplay.addEventListener("click", () => {
        if (isRunning) return; // Futás közben ne lehessen átírni
        const input = prompt("Hány másodpercre szeretnéd állítani az időzítőt?", defaultTime);
        if (input !== null && !isNaN(input) && input > 0) {
            defaultTime = parseInt(input);
            timeLeft = defaultTime;
            timerDisplay.textContent = formatTime(timeLeft);
        }
    });

    startBtn.addEventListener("click", () => {
        if (isRunning) {
            clearInterval(timerId);
            isRunning = false;
            startBtn.textContent = "▶";
        } else {
            isRunning = true;
            startBtn.textContent = "⏸";
            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    timerDisplay.textContent = formatTime(timeLeft);
                } else {
                    clearInterval(timerId);
                    isRunning = false;
                    startBtn.textContent = "▶";
                    timerDisplay.textContent = "KÉSZ!";
                    beep();
                }
            }, 1000);
        }
    });

    resetBtn.addEventListener("click", () => {
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = "▶";
        timeLeft = defaultTime; // A legutóbb beállított időre áll vissza
        timerDisplay.textContent = formatTime(timeLeft);
    });