// ---------------------
// МОДАЛКА НАСТРОЕК
// ---------------------
function openSettingsModal() {
    document.getElementById("settings-modal").hidden = false;
}

function closeSettingsModal() {
    document.getElementById("settings-modal").hidden = true;
}

function updateLimitLabel() {
    const val = document.getElementById("limit-range").value;
    document.getElementById("limit-value").textContent = val;
}


// ---------------------
// REELS ЛОГИКА
// ---------------------

let reelMax = 3;
let reelCount = 1;

try {
    const saved = localStorage.getItem("reels_limit");
    if (saved) reelMax = parseInt(saved);
} catch { }

function nextReel(e) {
    if (e) e.stopPropagation();

    reelCount++;

    if (reelCount > reelMax) {
        document.getElementById("reels-overlay").hidden = false;
        return;
    }

    document.getElementById("reel-counter").textContent =
        reelCount + " / " + reelMax;
}
