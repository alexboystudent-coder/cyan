document.addEventListener("DOMContentLoaded", () => {
    // A heti beosztás (összes nap benne van, a kedd, péntek és vasárnap frissítve)
    const schedule = {
        0: { // Hétfő
            title: "🦵 HÉTFŐ: LÁBEDZÉS #1 & ACHILLES",
            tasks: [
                { id: "mon_squat", text: "🏋️ Guggolás", desc: "2x10 ismétlés. Állítható súllyal a saját szintednek megfelelően.", hasInput: true, unit: "kg" },
                { id: "mon_jumps", text: "⚡ Váltottlábas ugrás", desc: "2x10 ismétlés (dinamikus kitörésből ugrás)." },
                { id: "mon_cardio", text: "🔥 Választható Állóképesség", desc: "Válassz egyet: Sprintek (5x50m) / Ugrálókötél (3 perc) / Magasugrás (3x8)." },
                { id: "mon_achilles", text: "🦶 Achilles Training", desc: "Excentrikus vádli emelés lépcsőfokon: 2x12 lassan leengedve." }
            ]
        },       
        1: { // Kedd (Csak a megadott speciális feladatokkal)
            title: "👀 KEDD: SZEM & TARTÁS & SECRET",
            tasks: [
                { id: "tue_eye", text: "👁️ Szem edzés (Fókuszváltás 8-as alakban)", desc: "10-10 kör mindkét irányba, majd közeli és távoli pont váltott fókuszálása 2 percig." },
                { id: "tue_chin", text: "📏 Chin Tucks", desc: "2x20 ismétlés. Húzd hátra az állad, mintha tokát csinálnál, tartsd meg 2 mp-ig." },
                { id: "tue_fingers", text: "✋ Ujjak edzése", desc: "Ujjnyújtás gumiszalaggal vagy szorítógyakorlat: 3x15 ismétlés mindkét kézen.", hasInput: true, unit: "szint" },
                { id: "tue_secret", text: "🔒 Titkos Protokoll", desc: "15 perc mély fókuszú légzés / Vizualizáció a céljaidról csendben." }
            ]
        },
        2: { // Szerda
            title: "💆 SZERDA: NYAK & JAW RECOVERY",
            tasks: [
                { id: "wed_neck_back", text: "🔄 Hátsó nyak körzés", desc: "2x15 lassan, kontrolláltan mindkét irányba." },
                { id: "wed_neck_side", text: "🔄 Oldalsó nyak körzés", desc: "2x15 finom vállhoz döntés és körzés." },
                { id: "wed_jaw", text: "🦴 Jaw Training", desc: "Állkapocs tónusgyakorlat: rágóizom feszítés 3x30 mp (szájpadlásra szorított nyelvvel)." }
            ]
        },
        3: { // Csütörtök
            title: "🦵 CSÜTÖRTÖK: LÁBEDZÉS #2 & ACHILLES",
            tasks: [
                { id: "thu_squat", text: "🏋️ Guggolás", desc: "2x10 ismétlés. Állítható súllyal.", hasInput: true, unit: "kg" },
                { id: "thu_jumps", text: "⚡ Váltottlábas ugrás", desc: "2x10 ismétlés." },
                { id: "thu_cardio", text: "🔥 Választható Állóképesség", desc: "Válassz egyet: Sprintek / Ugrálókötél / Magasugrás." },
                { id: "thu_achilles", text: "🦶 Achilles Training", desc: "2x15 sarokemelés és megtartás." },
                { id: "thu_secret", text: "🔒 Titkos Protokoll", desc: "15 perc mély fókuszú légzés / Vizualizáció a céljaidról csendben." }
            ]
        },
        4: { // Péntek (Csak a megadott speciális feladatokkal)
            title: "👁️ PÉNTEK: SZEM & CHIN TUCKS",
            tasks: [
                { id: "fri_eye", text: "👁️ Szem edzés (Tornáztatás)", desc: "Nézz fel-le, balra-jobbra 15-ször a fej mozgatása nélkül." },
                { id: "fri_chin", text: "📏 Chin Tucks", desc: "2x20 ismétlés a helyes nyaki tartásért." }
            ]
        },
        5: { // Szombat
            title: "💆 SZOMBAT: FULL NYAK & JAW PROTOKOL",
            tasks: [
                { id: "sat_neck_back", text: "🔄 Hátsó nyak körzés", desc: "2x15 ismétlés." },
                { id: "sat_neck_side", text: "🔄 Oldalsó nyak körzés", desc: "2x15 ismétlés." },
                { id: "sat_jaw", text: "🦴 Jaw Training", desc: "Állkapocs ellenállás gyakorlat (kézzel tartott áll nyitás/zárás) 3x10." }
            ]
        },
        6: { // Vasárnap (Csak a megadott speciális feladatokkal)
            title: "🧘 VASÁRNAP: SZEM PIHENTETÉS & TITKOS PROTOKOLL",
            tasks: [
                { id: "sun_eye", text: "👁️ Szem pihentetés", desc: "Meleg tenyérrátornyozás (Palming) 3 percig." },
                { id: "sun_secret", text: "🔒 Titkos Protokoll", desc: "Heti értékelés és jövő heti célok kitűzése." }
            ]
        }
    };

    // Automatikusan a mai nap indexének meghatározása (0 = Hétfő, ..., 6 = Vasárnap)
    let todayIndex = new Date().getDay();
    let currentDayIndex = (todayIndex === 0) ? 6 : todayIndex - 1;

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
            currentDayIndex = (currentDayIndex - 1 + 7) % 7;
            renderDay(currentDayIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentDayIndex = (currentDayIndex + 1) % 7;
            renderDay(currentDayIndex);
        });
    }

    renderDay(currentDayIndex);
});
