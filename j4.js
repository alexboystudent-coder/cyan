
document.addEventListener("DOMContentLoaded", () => {

    const schedule = {
        0: {
            title: "💪 HÉTFŐ: NYAKEDZÉS",
            tasks: [
                {
                    id: "mon_neck",
                    text: "💆 Nyakedzés",
                    desc: "Kontrollált, könnyű nyakerősítő gyakorlatok. Ne használj nagy ellenállást."
                },
                {
                    id: "mon_secret",
                    text: "🔒 Titkos Protokoll",
                    desc: "15 perc mély fókuszú légzés és vizualizáció a céljaidról."
                }
            ]
        },

        1: {
            title: "👁️ KEDD: SZEM & UJJAK",
            tasks: [
                {
                    id: "tue_eye",
                    text: "👁️ Szemgyakorlat",
                    desc: "Közeli és távoli pontok váltott fókuszálása 2 percig."
                },
                {
                    id: "tue_fingers",
                    text: "✋ Ujjak edzése",
                    desc: "Ujjnyújtás gumiszalaggal: 3x15 ismétlés, kényelmes ellenállással."
                },
                {
                    id: "tue_secret",
                    text: "🔒 Titkos Protokoll",
                    desc: "15 perc mély fókuszú légzés és vizualizáció."
                }
            ]
        },

        2: {
            title: "🦴 SZERDA: JAW TRAINING",
            tasks: [
                {
                    id: "wed_jaw",
                    text: "🦴 Jaw Training",
                    desc: "Finom állkapocs-mobilizálás és lazítás. Ne alkalmazz erős ellenállást vagy túlzott rágást."
                }
            ]
        },

        3: {
            title: "📏 CSÜTÖRTÖK: CHIN TUCKS",
            tasks: [
                {
                    id: "thu_chin",
                    text: "📏 Chin Tucks",
                    desc: "2x15 ismétlés. Húzd finoman hátra az állad, tartsd 2 másodpercig."
                },
                {
                    id: "thu_secret",
                    text: "🔒 Titkos Protokoll",
                    desc: "15 perc mély fókuszú légzés és vizualizáció."
                }
            ]
        },

        4: {
            title: "💪 PÉNTEK: NYAK & SZEM",
            tasks: [
                {
                    id: "fri_neck",
                    text: "💆 Nyakedzés",
                    desc: "Kontrollált, könnyű nyakerősítő gyakorlatok."
                },
                {
                    id: "fri_eye",
                    text: "👁️ Szemgyakorlat",
                    desc: "Közeli és távoli fókuszváltás 2 percig."
                },
                {
                    id: "fri_secret",
                    text: "🔒 Titkos Protokoll",
                    desc: "15 perc mély fókuszú légzés és vizualizáció."
                }
            ]
        },

        5: {
            title: "🦴 SZOMBAT: JAW & UJJAK",
            tasks: [
                {
                    id: "sat_jaw",
                    text: "🦴 Jaw Training",
                    desc: "Finom állkapocs-mobilizálás és lazítás."
                },
                {
                    id: "sat_fingers",
                    text: "✋ Ujjak edzése",
                    desc: "Ujjnyújtás gumiszalaggal: 3x15 ismétlés."
                }
            ]
        },

        6: {
            title: "📏 VASÁRNAP: CHIN TUCKS",
            tasks: [
                {
                    id: "sun_chin",
                    text: "📏 Chin Tucks",
                    desc: "2x15 ismétlés, finom kontrollált mozgással."
                },
                {
                    id: "sun_secret",
                    text: "🔒 Titkos Protokoll",
                    desc: "Heti értékelés, célok áttekintése és 15 perc fókusz."
                }
            ]
        }
    };

    // MAI NAP MEGHATÁROZÁSA
    let todayIndex = new Date().getDay();
    let currentDayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    const label = document.getElementById("current-day-label");
    const container = document.getElementById("task-container");
    const prevBtn = document.getElementById("prev-day");
    const nextBtn = document.getElementById("next-day");

    // LOCAL STORAGE BETÖLTÉSE
    let savedData = {};

    try {
        savedData = JSON.parse(
            localStorage.getItem("special_workout_data")
        ) || {};
    } catch (error) {
        savedData = {};
    }

    // NAP MEGJELENÍTÉSE
    function renderDay(index) {

        const dayData = schedule[index];

        if (!label || !container) return;

        label.innerText = dayData.title;
        container.innerHTML = "";

        dayData.tasks.forEach(task => {

            const isDone = savedData[task.id]?.done || false;

            const li = document.createElement("li");

            li.className = `task-item ${isDone ? "completed" : ""}`;

            li.innerHTML = `
                <div class="task-row-top">

                    <span class="task-text">
                        ${task.text}
                    </span>

                    <div class="task-actions">

                        <button
                            class="focus-btn"
                            onclick="toggleDesc('${task.id}')">
                            Leírás
                        </button>

                        <button
                            class="checkbox-btn"
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

    // LEÍRÁS MEGNYITÁSA / BEZÁRÁSA
    window.toggleDesc = (id) => {

        const box = document.getElementById(`desc-${id}`);

        if (box) {
            box.style.display =
                box.style.display === "block"
                    ? "none"
                    : "block";
        }
    };

    // FELADAT KÉSZRE JELÖLÉSE
    window.toggleDone = (id, dayIdx) => {

        if (!savedData[id]) {
            savedData[id] = {};
        }

        savedData[id].done = !savedData[id].done;

        localStorage.setItem(
            "special_workout_data",
            JSON.stringify(savedData)
        );

        renderDay(dayIdx);
    };

    // ELŐZŐ NAP
    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            currentDayIndex =
                (currentDayIndex - 1 + 7) % 7;

            renderDay(currentDayIndex);
        });
    }

    // KÖVETKEZŐ NAP
    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            currentDayIndex =
                (currentDayIndex + 1) % 7;

            renderDay(currentDayIndex);
        });
    }

    // KEZDŐNAP MEGJELENÍTÉSE
    renderDay(currentDayIndex);

});
