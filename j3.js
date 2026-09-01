document.addEventListener("DOMContentLoaded", () => {
    const prListContainer = document.getElementById("pr-list");
    const addBtn = document.getElementById("add-new-pr");

    // Modal Elemek
    const calcModal = document.getElementById("calc-modal");
    const openCalcBtn = document.getElementById("open-calc-btn");
    const closeCalcBtn = document.getElementById("close-calc-btn");
    const calcWeight = document.getElementById("calc-weight");
    const calcReps = document.getElementById("calc-reps");
    const calcResultValue = document.getElementById("calc-result-value");

    // Alapértelmezett PR lista, ha még nincs mentett adat
    const defaultPRs = [
        { id: "1", name: "Súlyos Húzódzkodás", value: "25", unit: "kg", date: "2026. 03. 10." },
        { id: "2", name: "Súlyos Tolódzkodás", value: "35", unit: "kg", date: "2026. 03. 12." },
        { id: "3", name: "Guggolás", value: "100", unit: "kg", date: "2026. 03. 01." },
        { id: "4", name: "Front Lever Tartás", value: "8", unit: "mp", date: "2026. 03. 15." }
    ];

    // Betöltés LocalStorage-ból
    let savedPRs = JSON.parse(localStorage.getItem("cyber_prs")) || defaultPRs;

    // Mai dátum formázása (ÉÉÉÉ. MM. DD.)
    function getTodayFormatted() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}. ${mm}. ${dd}.`;
    }

    // Lista kirajzolása
    function renderPRs() {
        prListContainer.innerHTML = "";
        savedPRs.forEach((pr, index) => {
            const card = document.createElement("div");
            card.className = "pr-card";
            card.innerHTML = `
                <div class="pr-info">
                    <h3>👑 ${pr.name}</h3>
                    <span class="pr-date">Módosítva: ${pr.date || "Nincs adat"}</span>
                </div>
                <div class="pr-value-box">
                    <input type="text" class="pr-input" data-index="${index}" value="${pr.value}">
                    <span class="unit">${pr.unit}</span>
                    <button class="delete-btn" data-index="${index}" title="Törlés">🗑️</button>
                </div>
            `;
            prListContainer.appendChild(card);
        });

        // Eseményfigyelők az Input mezőkre (Azonnali mentés + Dátum frissítés)
        document.querySelectorAll(".pr-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const idx = e.target.getAttribute("data-index");
                savedPRs[idx].value = e.target.value;
                savedPRs[idx].date = getTodayFormatted(); // Dátum frissítése
                localStorage.setItem("cyber_prs", JSON.stringify(savedPRs));
                renderPRs();
            });
        });

        // Eseményfigyelők a Törlés gombokra
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                if (confirm(`Biztosan törölni szeretnéd ezt: "${savedPRs[idx].name}"?`)) {
                    savedPRs.splice(idx, 1);
                    localStorage.setItem("cyber_prs", JSON.stringify(savedPRs));
                    renderPRs();
                }
            });
        });
    }

    // Új gyakorlat hozzáadása
    addBtn.addEventListener("click", () => {
        const name = prompt("Mi a gyakorlat neve? (pl. Fekvenyomás):");
        if (!name) return;
        const unit = prompt("Mi a mértékegység? (pl. kg vagy mp):", "kg");

        savedPRs.push({
            id: Date.now().toString(),
            name: name,
            value: "0",
            unit: unit || "kg",
            date: getTodayFormatted()
        });

        localStorage.setItem("cyber_prs", JSON.stringify(savedPRs));
        renderPRs();
    });

    // --- 1RM KALKULÁTOR LOGIKA (Epley Formula) ---
    function calculate1RM() {
        const w = parseFloat(calcWeight.value) || 0;
        const r = parseFloat(calcReps.value) || 0;

        if (w <= 0 || r <= 0) {
            calcResultValue.innerText = "0 kg";
            return;
        }

        if (r === 1) {
            calcResultValue.innerText = `${w} kg`;
            return;
        }

        // Epley képlet: W * (1 + r/30)
        const oneRM = Math.round(w * (1 + r / 30));
        calcResultValue.innerText = `~${oneRM} kg`;
    }

    // Modal megnyitása / bezárása
    openCalcBtn.addEventListener("click", () => {
        calcModal.style.display = "flex";
        calculate1RM();
    });

    closeCalcBtn.addEventListener("click", () => {
        calcModal.style.display = "none";
    });

    // Input figyelés a kalkulátorban
    calcWeight.addEventListener("input", calculate1RM);
    calcReps.addEventListener("input", calculate1RM);

    renderPRs();
});
