// home.js
document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = document.getElementById("pageTitle");
    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {

            // active состояние
            navButtons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            // убираем emoji и лишние символы
            const чистыйТекст = button.textContent
                .replace(/^[^\p{L}]+/gu, "")
                .trim();

            // специальная проверка для кнопки Мероприятия
            if (чистыйТекст === "Мероприятия") {
                window.location.href = "events.html";
                return; // останавливаем выполнение, чтобы не менять заголовок
            }

            // обновляем заголовок для остальных кнопок
            pageTitle.textContent = чистыйТекст;
        });
    });
});