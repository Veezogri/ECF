const teamContainer = document.querySelector("#teamContainer");



// Charger l'équipe depuis le stockage local

function loadTeam() {
    const teamContainer = document.querySelector("#teamContainer");
    teamContainer.innerHTML = ""; // Nettoyer l'affichage

    // Récupérer l'équipe depuis localStorage
    let team = JSON.parse(localStorage.getItem("pokemonTeam")) || [];

    if (team.length === 0) {
        teamContainer.innerHTML = "<p class='empty-team'>Votre équipe est vide ! Ajoutez des Pokémon depuis la liste.</p>";
        return;
    }

    team.forEach(pokemon => {
        const teamCard = document.createElement("div");
        teamCard.classList.add("team-card");

        teamCard.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <button class="removeFromTeam" data-id="${pokemon.id}">Retirer</button>
        `;

        teamContainer.appendChild(teamCard);
    });

    // Ajouter des événements pour retirer les Pokémon
    document.querySelectorAll(".removeFromTeam").forEach(button => {
        button.addEventListener("click", (e) => {
            const pokemonId = parseInt(e.target.getAttribute("data-id"));
            removeFromTeam(pokemonId);
        });
    });
}

// Fonction pour retirer un Pokémon de l'équipe
function removeFromTeam(id) {
    let team = JSON.parse(localStorage.getItem("pokemonTeam")) || [];
    team = team.filter(pokemon => pokemon.id !== id);

    localStorage.setItem("pokemonTeam", JSON.stringify(team)); // Mettre à jour localStorage

    loadTeam(); // Rafraîchir
}



// Charger l'équipe au démarrage de la page
document.addEventListener("DOMContentLoaded", loadTeam);




