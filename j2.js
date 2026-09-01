let selectedDate = new Date();
selectedDate.setHours(0,0,0,0);

let history = {};
try {
    history = JSON.parse(localStorage.getItem('todo_history_napi')) || {};
} catch (e) {
    history = {};
}

// Mindennap megjelenő állandó teendők listája
const dailyTasks = [
    { id: 'napi_1', name: '💧 Folyadékbevitel' },
    { id: 'napi_2', name: '✨ Esti / Reggeli ápolás' },
    { id: 'napi_3', name: '🏋️‍♂️ Regeneráció / Edzés' }
];

// Fókusz időzítő változók
let activeTaskId = null;
let timerInterval = null;
let isTimerRunning = false;

function formatDateKey(date) {
    let y = date.getFullYear();
    let m = String(date.getMonth() + 1).padStart(2, '0');
    let d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function changeDay(offset) {
    selectedDate.setDate(selectedDate.getDate() + offset);
    renderUI();
}

function updateStreak() {
    const streakElement = document.getElementById('streak-counter');
    if (!streakElement) return;

    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0,0,0,0);

    while (true) {
        const key = formatDateKey(checkDate);
        if (history[key] && history[key].length === dailyTasks.length) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    if (streak > 0) {
        streakElement.innerText = `🔥 ${streak} napos sorozat!`;
    } else {
        streakElement.innerText = `🌱 Kezdd el!`;
    }
}

function renderUI() {
    const dateKey = formatDateKey(selectedDate);
    if (!history[dateKey]) history[dateKey] = [];

    const dateLabel = document.getElementById('current-date-label');
    if (dateLabel) {
        dateLabel.innerText = selectedDate.toLocaleDateString('hu-HU', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    const taskContainer = document.getElementById('task-list-container');
    if (taskContainer) {
        taskContainer.innerHTML = '';

        dailyTasks.forEach(task => {
            const isDone = history[dateKey].includes(task.id);
            const li = document.createElement('li');
            li.className = `task-item ${isDone ? 'completed' : ''}`;

            li.innerHTML = `
                <span class="task-text">${task.name}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="nav-btn" onclick="openFocus('${task.id}', '${task.name}')">⏱️</button>
                    <button class="checkbox-btn nav-btn ${isDone ? 'done' : ''}">
                        ${isDone ? '✓ Kész' : 'Kész'}
                    </button>
                </div>
            `;

            const btn = li.querySelector('.checkbox-btn');
            btn.addEventListener('click', () => {
                const index = history[dateKey].indexOf(task.id);
                if (index === -1) {
                    history[dateKey].push(task.id);
                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                    }
                } else {
                    history[dateKey].splice(index, 1);
                }
                localStorage.setItem('todo_history_napi', JSON.stringify(history));
                renderUI();
            });

            taskContainer.appendChild(li);
        });
    }

    updateStreak();
}

// --- FÓKUSZ IDŐZÍTŐ STRUKTÚRA HÁTTÉR-TÁMOGATÁSSAL ---

function openFocus(taskId, taskName) {
    activeTaskId = taskId;
    document.getElementById('focus-task-name').innerText = taskName;
    document.getElementById('focus-modal').style.display = 'flex';
    
    // Ellenőrizzük, hogy fut-e már elmentett időzítő
    const savedEndTime = localStorage.getItem('active_timer_end');
    const savedTask = localStorage.getItem('active_timer_task');

    if (savedEndTime && savedTask === taskId) {
        resumeTimer();
    } else {
        document.getElementById('timer-setup-zone').style.display = 'block';
        document.getElementById('timer-countdown-zone').style.display = 'none';
        document.getElementById('timer-control').innerText = 'Indítás';
    }
}

function closeFocus() {
    // Ha az időzítő fut, gátoljuk meg a véletlen bezárást
    if (isTimerRunning) {
        alert("Az időzítő fut! Állítsd le a 'Szünet' gombbal a bezáráshoz.");
        return;
    }
    document.getElementById('focus-modal').style.display = 'none';
    clearInterval(timerInterval);
}

function updateSliderDisplay(val) {
    document.getElementById('slider-minutes').innerText = val;
}

function toggleTimer() {
    const btn = document.getElementById('timer-control');

    if (!isTimerRunning) {
        // Időzítő Indítása
        let remainingSeconds;
        const savedRemaining = localStorage.getItem('active_timer_paused_sec');

        if (savedRemaining) {
            remainingSeconds = parseInt(savedRemaining);
            localStorage.removeItem('active_timer_paused_sec');
        } else {
            const mins = parseInt(document.getElementById('timer-slider').value);
            remainingSeconds = mins * 60;
        }

        const endTime = Date.now() + (remainingSeconds * 1000);
        localStorage.setItem('active_timer_end', endTime);
        localStorage.setItem('active_timer_task', activeTaskId);

        startCountdown();
    } else {
        // Időzítő Szüneteltetése
        clearInterval(timerInterval);
        isTimerRunning = false;
        btn.innerText = 'Folytatás';

        const endTime = parseInt(localStorage.getItem('active_timer_end'));
        const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        localStorage.setItem('active_timer_paused_sec', remaining);
        localStorage.removeItem('active_timer_end');
    }
}

function startCountdown() {
    document.getElementById('timer-setup-zone').style.display = 'none';
    document.getElementById('timer-countdown-zone').style.display = 'block';
    
    const btn = document.getElementById('timer-control');
    btn.innerText = 'Szünet';
    isTimerRunning = true;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const endTime = parseInt(localStorage.getItem('active_timer_end'));
        const now = Date.now();
        const secondsLeft = Math.round((endTime - now) / 1000);

        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            
            localStorage.removeItem('active_timer_end');
            localStorage.removeItem('active_timer_task');
            localStorage.removeItem('active_timer_paused_sec');

            // Megjelöljük készként a feladatot
            const dateKey = formatDateKey(selectedDate);
            if (!history[dateKey].includes(activeTaskId)) {
                history[dateKey].push(activeTaskId);
                localStorage.setItem('todo_history_napi', JSON.stringify(history));
            }

            if (typeof confetti === 'function') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

            closeFocus();
            renderUI();
        } else {
            const m = Math.floor(secondsLeft / 60);
            const s = secondsLeft % 60;
            document.getElementById('timer-display').innerText = 
                `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }, 1000);
}

function resumeTimer() {
    startCountdown();
}

// Oldal betöltésekor ellenőrizzük, hogy futott-e háttérben időzítő
document.addEventListener('DOMContentLoaded', () => {
    renderUI();

    const savedEndTime = localStorage.getItem('active_timer_end');
    const savedTask = localStorage.getItem('active_timer_task');

    if (savedEndTime && savedTask) {
        const taskObj = dailyTasks.find(t => t.id === savedTask);
        if (taskObj) {
            openFocus(taskObj.id, taskObj.name);
        }
    }
});