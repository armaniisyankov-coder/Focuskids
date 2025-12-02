// ---------- Бургер-меню на главном сайте ----------
const navToggle = document.getElementById("navToggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}

// ---------- Фильтр "умной ленты" на экране ребёнка ----------
const topicChips = document.querySelectorAll(".chip[data-topic]");
const feedCards = document.querySelectorAll(".feed-card[data-topic]");

if (topicChips.length && feedCards.length) {
    topicChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const topic = chip.dataset.topic;

            // активный чип
            topicChips.forEach((c) => c.classList.remove("chip-active"));
            chip.classList.add("chip-active");

            // фильтрация карточек
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
}

// ---------- Reels: кнопка "⏭" пролистывает на следующий ролик ----------
const nextButtons = document.querySelectorAll("[data-next]");
const reelsWrapper = document.querySelector(".reels-wrapper");
const reels = document.querySelectorAll(".reel");

if (nextButtons.length && reelsWrapper && reels.length) {
    nextButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const next = reels[index + 1];
            if (next) {
                next.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}
