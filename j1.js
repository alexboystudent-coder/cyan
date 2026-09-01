// Globális változók
const BASE_DATE = new Date(2026, 0, 1);
BASE_DATE.setHours(0, 0, 0, 0);

// Itt biztosítjuk, hogy a selectedDate pont a mai nap éjfélje legyen (helyi idő szerint)
let selectedDate = new Date();
selectedDate.setHours(0, 0, 0, 0);

let history = {};
try {
    history = JSON.parse(localStorage.getItem('todo_history_ez1')) || {};
} catch (e) {
    history = {};
}

function formatDateKey(date) {
    let y = date.getFullYear();
    let m = String(date.getMonth() + 1).padStart(2, '0');
    let d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getDaysDifference(d1, d2) {
    // Pontos napkülönbség számítás az óraeltérések elkerülésével
    const oneDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.round((utc1 - utc2) / oneDay);
}

// Napváltó függvény (a gombok ezt hívják meg)
function changeDay(offset) {
    selectedDate.setDate(selectedDate.getDate() + offset);
    renderUI();
}

function renderUI() {
    const dateKey = formatDateKey(selectedDate);
    if (!history[dateKey]) history[dateKey] = [];

    // Dátum kijelző frissítése
    const dateLabel = document.getElementById('current-date-label');
    if (dateLabel) {
        dateLabel.innerText = selectedDate.toLocaleDateString('hu-HU', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    const diffDays = getDaysDifference(selectedDate, BASE_DATE);
    const scheduledTasks = [];

    // Nyújtás: 3 naponta
    if (Math.abs(diffDays) % 3 === 0) {
        scheduledTasks.push({ id: 'nyujtas', name: '🧘‍♂️ Nyújtás' });
    }

    // Logikai játék: 2 naponta
    if (Math.abs(diffDays) % 2 === 0) {
        scheduledTasks.push({ id: 'logikai_jatek', name: '🧩 Logikai játék gyakorlás' });
    }

    // Hosszú fürdés: 3 naponta
    if (Math.abs(diffDays) % 3 === 0) {
        scheduledTasks.push({ id: 'hosszu_furdes', name: '🛁 Hosszú fürdés' });
    }

    // Lista megjelenítése
    const taskContainer = document.getElementById('task-list-container');
    if (taskContainer) {
        taskContainer.innerHTML = '';

        if (scheduledTasks.length === 0) {
            taskContainer.innerHTML = '<li style="color: #94a3b8; padding: 10px; text-align: center;">Ezen a napon nincs külön ütemezett feladat.</li>';
        } else {
            scheduledTasks.forEach(task => {
                const isDone = history[dateKey].includes(task.id);
                const li = document.createElement('li');
                li.className = `task-item ${isDone ? 'completed' : ''}`;
                li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 10px;';

                li.innerHTML = `
                    <span class="task-text" style="${isDone ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.name}</span>
                    <button class="checkbox-btn" style="padding: 6px 12px; cursor: pointer; border-radius: 6px; border: none; background: ${isDone ? '#22c55e' : '#3b82f6'}; color: white;">
                        ${isDone ? '✓ Kész' : 'Kész'}
                    </button>
                `;

                const btn = li.querySelector('.checkbox-btn');
                btn.addEventListener('click', () => {
                    const index = history[dateKey].indexOf(task.id);
                    if (index === -1) {
                        history[dateKey].push(task.id);
                    } else {
                        history[dateKey].splice(index, 1);
                    }
                    localStorage.setItem('todo_history_ez1', JSON.stringify(history));
                    renderUI();
                });

                taskContainer.appendChild(li);
            });
        }
    }
}

// Betöltéskor és gombesemények beállításakor
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prev-day-btn');
    const nextBtn = document.getElementById('next-day-btn');

    if (prevBtn) prevBtn.onclick = () => changeDay(-1);
    if (nextBtn) nextBtn.onclick = () => changeDay(1);

    renderUI();
});