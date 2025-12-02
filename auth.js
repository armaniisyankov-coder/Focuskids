/* ---------- РЕГИСТРАЦИЯ ---------- */
const registerBtn = document.getElementById("btn-register");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const email = document.getElementById("reg-email").value;
        const pass = document.getElementById("reg-pass").value;

        if (!email || !pass) {
            document.getElementById("reg-error").textContent = "Введите email и пароль";
            return;
        }

        localStorage.setItem("fk_email", email);
        localStorage.setItem("fk_pass", pass);

        window.location.href = "login.html";
    });
}

/* ---------- ВХОД ---------- */
const loginBtn = document.getElementById("btn-login");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const email = document.getElementById("login-email").value;
        const pass = document.getElementById("login-pass").value;

        const savedEmail = localStorage.getItem("fk_email");
        const savedPass = localStorage.getItem("fk_pass");

        if (email === savedEmail && pass === savedPass) {
            localStorage.setItem("fk_logged", "1");
            window.location.href = "app-parent.html";
        } else {
            document.getElementById("login-error").textContent = "Неверный логин или пароль";
        }
    });
}

/* ---------- ЗАЩИТА СТРАНИЦЫ ---------- */
if (location.pathname.includes("app-parent.html")) {
    if (localStorage.getItem("fk_logged") !== "1") {
        window.location.href = "login.html";
    }
}
