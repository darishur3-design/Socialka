document.getElementById("profileName").textContent = user.name;
document.getElementById("profileRole").textContent = user.role;

if (user.role === "student") {
    document.getElementById("studentId").textContent = user.studentId;
    document.getElementById("positionRow").classList.add("hidden");
} else {
    document.getElementById("userPosition").textContent = user.position;
    document.getElementById("studentRow").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
}

user.events.forEach(e => {
    document.getElementById("userEvents").innerHTML += `<li>${e}</li>`;
});
