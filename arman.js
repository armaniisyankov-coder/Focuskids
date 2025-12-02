// ===== НАСТРОЙКИ ХРАНИЛИЩА =====
const SETTINGS_KEY = "focuskids-settings";

const defaultSettings = {
    allowShorts: true,
    shortsLimit: 3,
    maxMinutes: 40,
    preferredTopics: ["science", "animals", "space"],
};

function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { ...defaultSettings };
        const parsed = JSON.parse(raw);
        return { ...defaultSettings, ...parsed };
    } catch {
        return { ...defaultSettings };
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
        // игнорируем
    }
}

// ===== БУРГЕР-МЕНЮ НА ЛЕНДИНГЕ =====
const navToggle = document.getElementById("navToggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}

// ===== ПАНЕЛЬ РОДИТЕЛЯ =====
(function setupParentScreen() {
    const openBtn = document.getElementById("open-settings");
    const modal = document.getElementById("settings-modal");
    if (!openBtn || !modal) return; // значит мы не на странице родителя

    const closeBtn = document.getElementById("close-settings");
    const cancelBtn = document.getElementById("cancel-settings");
    const saveBtn = document.getElementById("save-settings");

    const allowShortsInput = document.getElementById("allow-shorts-input");
    const shortsLimitInput = document.getElementById("shorts-limit-input");
    const shortsLimitValue = document.getElementById("shorts-limit-value");
    const maxMinutesInput = document.getElementById("max-minutes-input");

    const shortLimitText = document.getElementById("settings-short-limit-text");
    const shortLimitInline = document.getElementById("settings-short-limit-inline");
    const shortsAllowedText = document.getElementById("settings-shorts-allowed-text");
    const maxMinutesText = document.getElementById("settings-max-minutes");

    const topicsContainer = document.getElementById("parent-topics");
    const shareBtn = document.getElementById("share-rules");
    const shareHint = document.getElementById("share-hint");

    let settings = loadSettings();

    // применяем настройки к интерфейсу
    function applySettingsToUI() {
        if (allowShortsInput) allowShortsInput.checked = settings.allowShorts;

        if (shortsLimitInput) shortsLimitInput.value = settings.shortsLimit;
        if (shortsLimitValue) shortsLimitValue.textContent = String(settings.shortsLimit);

        if (maxMinutesInput) maxMinutesInput.value = settings.maxMinutes;

        if (shortLimitText) shortLimitText.textContent = settings.shortsLimit;
        if (shortLimitInline) shortLimitInline.textContent = String(settings.shortsLimit);

        if (shortsAllowedText) {
            shortsAllowedText.textContent = settings.allowShorts
                ? "разрешены в режиме обучения"
                : "полностью отключены";
        }
        if (maxMinutesText) maxMinutesText.textContent = String(settings.maxMinutes);

        // подсветка выбранных тем
        if (topicsContainer) {
            topicsContainer
                .querySelectorAll("[data-topic-toggle]")
                .forEach((btn) => {
                    const topic = btn.getAttribute("data-topic-toggle");
                    if (settings.preferredTopics.includes(topic)) {
                        btn.classList.add("chip-active");
                    } else {
                        btn.classList.remove("chip-active");
                    }
                });
        }
    }

    applySettingsToUI();

    // управление модалкой
    function openModal() {
        modal.hidden = false;
    }

    function closeModal() {
        modal.hidden = true;
    }

    openBtn.addEventListener("click", openModal);

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // закрытие по клику по фону вокруг окна
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // обновляем цифру под ползунком
    if (shortsLimitInput && shortsLimitValue) {
        shortsLimitInput.addEventListener("input", () => {
            shortsLimitValue.textContent = shortsLimitInput.value;
        });
    }

    // сохранение настроек
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            if (allowShortsInput) {
                settings.allowShorts = allowShortsInput.checked;
            }
            if (shortsLimitInput) {
                settings.shortsLimit = Number(shortsLimitInput.value) || 3;
            }
            if (maxMinutesInput) {
                settings.maxMinutes = Number(maxMinutesInput.value) || 40;
            }

            // собираем отмеченные темы
            const newTopics = [];
            if (topicsContainer) {
                topicsContainer
                    .querySelectorAll("[data-topic-toggle]")
                    .forEach((btn) => {
                        const topic = btn.getAttribute("data-topic-toggle");
                        if (btn.classList.contains("chip-active")) {
                            newTopics.push(topic);
                        }
                    });
            }
            settings.preferredTopics =
                newTopics.length > 0 ? newTopics : [...defaultSettings.preferredTopics];

            saveSettings(settings);
            applySettingsToUI();
            closeModal();
        });
    }

    // переключение тем
    if (topicsContainer) {
        topicsContainer
            .querySelectorAll("[data-topic-toggle]")
            .forEach((btn) => {
                btn.addEventListener("click", () => {
                    btn.classList.toggle("chip-active");
                });
            });
    }

    // поделиться правилами
    if (shareBtn && shareHint) {
        shareBtn.addEventListener("click", async () => {
            const text =
                "Наши правила:\n" +
                `• максимум ${settings.maxMinutes} минут видео в будни;\n` +
                `• короткие ролики не более ${settings.shortsLimit} подряд;\n` +
                "• Reels " +
                (settings.allowShorts
                    ? "разрешены в учебном режиме."
                    : "сейчас отключены.");

            try {
                await navigator.clipboard.writeText(text);
                shareHint.hidden = false;
                setTimeout(() => (shareHint.hidden = true), 2500);
            } catch {
                shareHint.textContent =
                    "Не удалось скопировать, но правила можно прочитать выше.";
                shareHint.hidden = false;
            }
        });
    }
})();

// ===== ЛЕНТА РЕБЁНКА =====
(function setupChildFeed() {
    const topicChips = document.querySelectorAll(".chip[data-topic]");
    const feedCards = document.querySelectorAll(".feed-card[data-topic]");
    if (!topicChips.length || !feedCards.length) return;

    const navReels = document.getElementById("nav-reels");
    const subtitle = document.getElementById("child-subtitle");
    const settings = loadSettings();

    // подсветка тем, которые выбрал родитель
    topicChips.forEach((chip) => {
        const topic = chip.dataset.topic;
        if (
            topic !== "all" &&
            settings.preferredTopics &&
            settings.preferredTopics.includes(topic)
        ) {
            chip.classList.add("chip-active-preferred");
        }
    });

    // текст под заголовком
    if (subtitle) {
        const topicsCount =
            settings.preferredTopics && settings.preferredTopics.length
                ? settings.preferredTopics.length
                : "нескольких";
        subtitle.textContent = `Лента настроена родителем: приоритет у ${topicsCount} тем, короткие Reels ${
            settings.allowShorts ? "разрешены в учебном режиме" : "сейчас отключены"
        }.`;
    }

    // скрываем пункт Reels, если родитель отключил
    if (navReels && !settings.allowShorts) {
        navReels.classList.add("disabled");
    }

    // фильтрация карточек по теме
    topicChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const topic = chip.dataset.topic;
            topicChips.forEach((c) => c.classList.remove("chip-active"));
            chip.classList.add("chip-active");

            feedCards.forEach((card) => {
                const cardTopic = card.dataset.topic;
                if (topic === "all" || topic === cardTopic) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
})();

// ===== REELS =====
(function setupReels() {
    const reelsWrapper = document.querySelector(".reels-wrapper");
    const reels = document.querySelectorAll(".reel");
    const nextButtons = document.querySelectorAll("[data-next]");
    const overlay = document.getElementById("reels-overlay");
    const overlayText = document.getElementById("reels-overlay-text");
    if (!reelsWrapper || !reels.length || !overlay || !overlayText) return;

    const settings = loadSettings();

    // если родитель отключил Reels
    if (!settings.allowShorts) {
        overlayText.textContent =
            "Reels отключены родителем. Посмотри ленту с обучающими видео.";
        overlay.hidden = false;
        return;
    }

    let viewed = 0;
    const maxViewed = settings.shortsLimit || 3;

    nextButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            if (viewed >= maxViewed - 1) {
                overlayText.textContent =
                    "Лимит коротких роликов исчерпан. Вернись к обучающей ленте 🙂";
                overlay.hidden = false;
                return;
            }
            const next = reels[index + 1];
            if (next) {
                viewed += 1;
                next.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
})();
