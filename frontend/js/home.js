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

            // обновляем заголовок
            pageTitle.textContent = чистыйТекст;
        });
    });
});
