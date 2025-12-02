// бургер-меню на мобиле
const navToggle = document.getElementById("navToggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}
