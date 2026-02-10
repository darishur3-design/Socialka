function renderEvents(filter) {
    const list = document.getElementById("eventsList");
    list.innerHTML = "";

    events
        .filter(e => filter === "all" || e.type === filter)
        .forEach(e => {
            const card = document.createElement("div");
            card.className = "card";
            card.textContent = e.title;

            card.onclick = () => {
                document.getElementById("eventDetails").classList.remove("hidden");
                document.getElementById("eventDetails").innerHTML = `
                    <h3>${e.title}</h3>
                    <p>${e.description}</p>
                    <p><b>Участие фиксируется через QR-код</b></p>
                `;
            };

            list.appendChild(card);
        });
}

renderEvents("all");
document.getElementById("eventFilter").onchange = e => renderEvents(e.target.value);
