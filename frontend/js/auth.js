const title = document.getElementById("authTitle");
const switchBtn = document.getElementById("switchBtn");
const submitBtn = document.getElementById("submitBtn");
const repeatPassword = document.getElementById("repeatPassword");
const backBtn = document.getElementById("backBtn");
const footerText = document.getElementById("footerText");

let isRegister = false;

switchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
});

backBtn.addEventListener("click", () => {
    showLogin();
});

function showRegister() {
    isRegister = true;

    title.textContent = "Регистрация";
    submitBtn.textContent = "Зарегистрироваться";

    repeatPassword.style.display = "block";
    backBtn.style.display = "flex";

    footerText.textContent = "Уже есть аккаунт?";
    switchBtn.textContent = "Войти";
}

function showLogin() {
    isRegister = false;

    title.textContent = "Авторизация";
    submitBtn.textContent = "Войти";

    repeatPassword.style.display = "none";
    backBtn.style.display = "none";

    footerText.textContent = "Нет аккаунта?";
    switchBtn.textContent = "Регистрация";
}
