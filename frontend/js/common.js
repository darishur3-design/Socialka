document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = () => {
        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(item.dataset.page).classList.add("active");
    };
});

document.getElementById("openProfile").onclick = () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById("profile").classList.add("active");

    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
};

document.getElementById("headerUserName").textContent = user.name;
