document.addEventListener("DOMContentLoaded", () => {
    // Csak a Speciális napok: Kedd (1), Péntek (4) és Vasárnap (6)
    const schedule = {
        0: { // Kedd (Index 0 a tömbben)
            title: "👀 KEDD: SZEM & TARTÁS & SECRET",
            tasks: [
                { id: "tue_eye", text: "👁️ Szem edzés (Fókuszváltás 8-as alakban)", desc: "10-10 kör mindkét irányba, majd közeli és távoli pont váltott fókuszálása 2 percig." },
                { id: "tue_chin", text: "📏 Chin Tucks", desc: "2x20 ismétlés. Húzd hátra az állad, mintha tokát csinálnál, tartsd meg 2 mp-ig." },
                { id: "tue_fingers", text: "✋ Ujjak edzése", desc: "Ujjnyújtás gumiszalaggal vagy szorítógyakorlat: 3x15 ismétlés mindkét kézen.", hasInput: true, unit: "szint" },
                { id: "tue_secret", text: "🔒 Titkos Protokoll", desc: "15 perc mély fókuszú légzés / Vizualizáció a céljaidról csendben." }
            ]
        },
        1: { // Péntek (Index 1 a tömbben)
            title: "👁️ PÉNTEK: SZEM & CHIN TUCKS & SECRET",
            tasks: [
                { id: "fri_eye", text: "👁️ Szem edzés (Tornáztatás)", desc: "Nézz fel-le, balra-jobbra 15-ször a fej mozgatása nélkül." },
                { id: "fri_chin", text: "📏 Chin Tucks", desc: "2x20 ismétlés a helyes nyaki tartásért." }
            ]
        },
        2: { // Vasárnap (Index 2 a tömbben)
            title: "🧘 VASÁRNAP: PIHENŐ & TITKOS REGENERÁCIÓ",
            tasks: [
                { id: "sun_eye", text: "👁️ Szem pihentetés", desc: "Meleg tenyérrátornyozás (Palming) 3 percig." },
                { id: "sun_secret", text: "🔒 Titkos Protokoll", desc: "Heti értékelés és jövő heti célok kitűzése." }
            ]
        }
    };

    const dayKeys = Object.keys(schedule);
    
    // Automatikus kezdőnap kiválasztása a mai nap alapján (ha Kedd, Péntek vagy Vasárnap, azt mutatja, különben az elsőt)
    const jsDay = new Date().getDay(); // 0: Vasárnap, 2: Kedd, 5: Péntek
    let currentDayIndex = 0;
    
    if (jsDay === 2) currentDayIndex = 0;       // Kedd
    else if (jsDay === 5) currentDayIndex = 1;  // Péntek
    else if (jsDay === 0) currentDayIndex = 2;  // Vasárnap

    const label = document.getElementById("current-day-label");
    const container = document.getElementById("task-container");
    const prevBtn = document.getElementById("prev-day");
    const nextBtn = document.getElementById("next-day");

    // LocalStorage betöltés
    let savedData = JSON.parse(localStorage.getItem("special_workout_data")) || {};

    function renderDay(index) {
        const dayData = schedule[index];
        if (!label || !container) return;

        label.innerText = dayData.title;
        container.innerHTML = "";

        dayData.tasks.forEach(task => {
            const isDone = savedData[task.id]?.done || false;
            const weightVal = savedData[task.id]?.weight || "";

            const li = document.createElement("li");
            li.className = `task-item ${isDone ? 'completed' : ''}`;

            li.innerHTML = `
                <div class="task-row-top">
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="focus-btn" onclick="toggleDesc('${task.id}')">Leírás</button>
                        <button class="checkbox-btn" onclick="toggleDone('${task.id}', ${index})">
                            ${isDone ? '✓ Kész' : 'Kész'}
                        </button>
                    </div>
                </div>
                ${task.hasInput ? `
                    <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
                        <label style="font-size: 0.85rem; color: #94a3b8;">Súly:</label>
                        <input type="number" value="${weightVal}" placeholder="0" 
                               style="width: 70px; background: rgba(15,23,42,0.8); border: 1px solid #f59e0b; color: #00ff87; text-align: center; border-radius: 6px; padding: 4px;"
                               onchange="saveWeight('${task.id}', this.value)">
                        <span style="font-size: 0.85rem; color: #94a3b8;">${task.unit}</span>
                    </div>
                ` : ''}
                <div class="plan-box" id="desc-${task.id}">
                    ${task.desc}
                </div>
            `;
            container.appendChild(li);
        });
    }

    window.toggleDesc = (id) => {
        const box = document.getElementById(`desc-${id}`);
        if (box) {
            box.style.display = box.style.display === "block" ? "none" : "block";
        }
    };

    window.toggleDone = (id, dayIdx) => {
        if (!savedData[id]) savedData[id] = {};
        savedData[id].done = !savedData[id].done;
        localStorage.setItem("special_workout_data", JSON.stringify(savedData));
        renderDay(dayIdx);
    };

    window.saveWeight = (id, val) => {
        if (!savedData[id]) savedData[id] = {};
        savedData[id].weight = val;
        localStorage.setItem("special_update_data", JSON.stringify(savedData));
        localStorage.setItem("special_workout_data", JSON.stringify(savedData));
    };

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentDayIndex = (currentDayIndex - 1 + dayKeys.length) % dayKeys.length;
            renderDay(currentDayIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentDayIndex = (currentDayIndex + 1) % dayKeys.length;
            renderDay(currentDayIndex);
        });
    }

    renderDay(currentDayIndex);
});
