function renderCommunities(filter) {
    const list = document.getElementById("communityList");
    list.innerHTML = "";

    communities
        .filter(c => filter === "all" || c.type === filter)
        .forEach(c => {
            const card = document.createElement("div");
            card.className = "card";
            card.textContent = c.name;

            card.onclick = () => {
                document.getElementById("communityDetails").classList.remove("hidden");
                document.getElementById("communityDetails").innerHTML = `
                    <h3>${c.name}</h3>
                    <p>${c.description}</p>
                `;
            };

            list.appendChild(card);
        });
}

renderCommunities("all");
document.getElementById("communityFilter").onchange = e => renderCommunities(e.target.value);
