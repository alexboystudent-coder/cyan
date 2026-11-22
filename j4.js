
document.addEventListener("DOMContentLoaded", () => {
    // Heti 5 napos program
    const schedule = {
        0: { // Hétfő
            title: "👀 HÉTFŐ: SZEM & TARTÁS",
            tasks: [
                {
                    id: "mon_eye",
                    text: "👁️ Szem fókuszváltás",
                    desc: "Közeli és távoli pontok váltott fókuszálása 2 percig."
                },
                {
                    id: "mon_chin",
                    text: "📏 Chin Tucks",
                    desc: "2x15 ismétlés. Húzd hátra az állad, tartsd meg 2 másodpercig."
                },
                {
                    id: "mon_fingers",
                    text: "✋ Ujjak edzése",
                    desc: "Ujjnyújtás gumiszalaggal: 3x15 ismétlés."
                }
            ]
        },

        1: { // Kedd
            title: "💆 KEDD: NYAK & JAW",
            tasks: [
                {
                    id: "tue_neck_back",
                    text: "🔄 Hátsó nyak",
                    desc: "Finom, kontrollált nyakmozgások. 2x10 ismétlés."
                },
                {
                    id: "tue_neck_side",
                    text: "🔄 Oldalsó nyak",
                    desc: "Finom oldalra döntések, erőltetés nélkül. 2x10."
                },
                {
                    id: "tue_jaw",
                    text: "🦴 Jaw Relaxation",
                    desc: "Állkapocs lazítása és természetes nyugalmi pozíciójának gyakorlása."
                }
            ]
        },

        2: { // Szerda
            title: "👁️ SZERDA: SZEM & UJJAК",
            tasks: [
                {
                    id: "wed_eye",
                    text: "👁️ Szem fókusz",
                    desc: "Közeli és távoli tárgyak váltott nézése 2 percig."
                },
                {
                    id: "wed_fingers",
                    text: "✋ Ujjak edzése",
                    desc: "Ujjnyújtás gumiszalaggal: 3x15 ismétlés."
                },
                {
                    id: "wed_posture",
                    text: "📏 Tartás gyakorlása",
                    desc: "Vállak természetes helyzetbe engedése és egyenes, kényelmes testtartás."
                }
            ]
        },

        3: { // Csütörtök
            title: "💆 CSÜTÖRTÖK: NYAK & TARTÁS",
            tasks: [
                {
                    id: "thu_neck",
                    text: "🔄 Nyak mobilizálás",
                    desc: "Finom oldalra döntések és kontrollált mozgások."
                },
                {
                    id: "thu_chin",
                    text: "📏 Chin Tucks",
                    desc: "2x15 ismétlés, 2 másodperces megtartással."
                },
                {
                    id: "thu_posture",
                    text: "🧍 Testtartás",
                    desc: "Tudatos, kényelmes testtartás gyakorlása."
                }
            ]
        },

        4: { // Péntek
            title: "👁️ PÉNTEK: SZEM & RECOVERY",
            tasks: [
                {
                    id: "fri_eye",
                    text: "👁️ Szem pihentetés",
                    desc: "Rendszeres szünetek a képernyőtől és távoli pontra nézés."
                },
                {
                    id: "fri_neck",
                    text: "🔄 Nyak lazítása",
                    desc: "Finom, fájdalommentes nyakmozgások."
                },
                {
                    id: "fri_recovery",
                    text: "🧘 Recovery",
                    desc: "5-10 perc nyugodt légzés és relaxáció."
                }
            ]
        }
    };

    // Mai nap meghatározása
    let todayIndex = new Date().getDay();
    let currentDayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    const label = document.getElementById("current-day-label");
    const container = document.getElementById("task-container");
    const prevBtn = document.getElementById("prev-day");
    const nextBtn = document.getElementById("next-day");

    // LocalStorage betöltése
    let savedData = JSON.parse(
        localStorage.getItem("special_workout_data")
    ) || {};

    function renderDay(index) {
        const dayData = schedule[index];

        if (!label || !container) return;

        if (!dayData) {
            label.innerText = "🧘 PIHENŐNAP";
            container.innerHTML = `
                <li class="task-item">
                    <span class="task-text">Pihenés és regeneráció</span>
                </li>
            `;
            return;
        }

        label.innerText = dayData.title;
        container.innerHTML = "";

        dayData.tasks.forEach(task => {
            const isDone = savedData[task.id]?.done || false;

            const li = document.createElement("li");
            li.className = `task-item ${isDone ? "completed" : ""}`;

            li.innerHTML = `
                <div class="task-row-top">
                    <span class="task-text">${task.text}</span>

                    <div class="task-actions">
                        <button class="focus-btn"
                            onclick="toggleDesc('${task.id}')">
                            Leírás
                        </button>

                        <button class="checkbox-btn"
                            onclick="toggleDone('${task.id}', ${index})">
                            ${isDone ? "✓ Kész" : "Kész"}
                        </button>
                    </div>
                </div>

                <div class="plan-box" id="desc-${task.id}">
                    ${task.desc}
                </div>
            `;

            container.appendChild(li);
        });
    }

    // Leírás megjelenítése
    window.toggleDesc = (id) => {
        const box = document.getElementById(`desc-${id}`);

        if (box) {
            box.style.display =
                box.style.display === "block" ? "none" : "block";
        }
    };

    // Feladat készre jelölése
    window.toggleDone = (id, dayIdx) => {
        if (!savedData[id]) savedData[id] = {};

        savedData[id].done = !savedData[id].done;

        localStorage.setItem(
            "special_workout_data",
            JSON.stringify(savedData)
        );

        renderDay(dayIdx);
    };

    // Előző nap
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentDayIndex = (currentDayIndex - 1 + 7) % 7;
            renderDay(currentDayIndex);
        });
    }

    // Következő nap
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentDayIndex = (currentDayIndex + 1) % 7;
            renderDay(currentDayIndex);
        });
    }

    renderDay(currentDayIndex);
});
