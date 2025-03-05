const teamContainer = document.querySelector("#teamContainer");



// Charger l'équipe depuis le stockage local

function loadTeam() {

    const team = JSON.parse(localStorage.getItem("team")) || [];

    teamContainer.innerHTML = "";



    team.forEach(pokemon => {

        const teamCard = document.createElement("div");

        teamCard.classList.add("pokemon-card");



        teamCard.innerHTML = `

            <img src="${pokemon.sprite}" alt="${pokemon.name}">

            <h3>${pokemon.name}</h3>

            <button class="removeFromTeam">Retirer</button>

        `;



        teamContainer.appendChild(teamCard);



        // Ajout de l'événement pour retirer un Pokémon

        const removeButton = teamCard.querySelector(".removeFromTeam");

        removeButton.addEventListener("click", () => removeFromTeam(pokemon.id));

    });

}



// Fonction pour ajouter un Pokémon à l'équipe (depuis index.html)

function addToTeam(id) {

    const pokemon = allPokemon.find(p => p.id === id);

    if (!pokemon) return;



    let team = JSON.parse(localStorage.getItem("team")) || [];

    if (team.length >= 6) {

        alert("Votre équipe est complète (6 Pokémon max) !");

        return;

    }



    team.push({

        id: pokemon.id,

        name: pokemon.name,

        sprite: pokemon.sprites.other["official-artwork"].front_default

    });



    localStorage.setItem("team", JSON.stringify(team));

}



// Fonction pour retirer un Pokémon de l'équipe

function removeFromTeam(id) {

    let team = JSON.parse(localStorage.getItem("team")) || [];

    team = team.filter(pokemon => pokemon.id !== id);

    localStorage.setItem("team", JSON.stringify(team));

    loadTeam();

}



// Charger l'équipe au démarrage

loadTeam();