const pokemonList = document.querySelector("#pokemonList");

const searchBar = document.querySelector("#searchBar");

const regionFilter = document.querySelector("#regionFilter");

const typeFilter = document.querySelector("#typeFilter");

const resetFilters = document.querySelector("#resetFilters");

const loadMoreButton = document.createElement("button");
const maincontainer = document.querySelector("#MainContainer");

loadMoreButton.textContent = "Afficher plus de Pokémon";

loadMoreButton.id = "loadMore";

maincontainer.appendChild(loadMoreButton);



let allPokemon = []; // Stocke tous les Pokémon pour le filtrage

let displayedPokemonCount = 0; // Compteur de Pokémon affichés

const batchSize = 20; // Nombre de Pokémon affichés à la fois

// fonction qui va chercher les pokemon de x à y (batchSize)
// limit=y&offset=x
// en gros x point de départ et y le nombre de pokemons qui seront affichés 

// Fonction pour récupérer les Pokémon

async function fetchPokemon() {

    for (let i = 1; i <= 251; i++) {

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);

        const pokemon = await res.json();

        allPokemon.push(pokemon);

    }



    displayNextBatch(); // Affiche les 20 premiers Pokémon

}



// Fonction pour afficher un lot de Pokémon

function displayNextBatch() {

    const nextBatch = allPokemon.slice(displayedPokemonCount, displayedPokemonCount + batchSize);

    nextBatch.forEach(displayPokemon);

    displayedPokemonCount += batchSize;



    if (displayedPokemonCount >= allPokemon.length) {

        loadMoreButton.style.display = "none"; // Cacher le bouton si tout est affiché

    }

}



// Fonction pour afficher un Pokémon sous forme de carte

function displayPokemon(pokemon) {

    const pokemonCard = document.createElement("div");



    // On prend le premier type du Pokémon pour la couleur de l'ombre (box-shadow)

    const primaryType = pokemon.types[0].type.name;

    pokemonCard.classList.add("pokemon-card", primaryType);



    // Création des types sous forme de badges colorés

    const types = pokemon.types.map(t =>

        `<span class="type ${t.type.name}">${t.type.name}</span>`

    ).join(" ");



    pokemonCard.innerHTML = `

        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">

        <h3>${pokemon.name}</h3>

        <p>#${pokemon.id}</p>

        <div class="types">${types}</div>

        <button class="DetailsPokemon">Détails</button>

        <button class="AddToTeam">Ajouter à mon équipe</button>

    `;



    // Ajout de la carte Pokémon au conteneur

    pokemonList.appendChild(pokemonCard);



    // Ajout des événements après l'insertion dans le DOM

    const detailsButton = pokemonCard.querySelector(".DetailsPokemon");

    const addToTeamButton = pokemonCard.querySelector(".AddToTeam");



    detailsButton.addEventListener("click", () => showDetails(pokemon.id));

    addToTeamButton.addEventListener("click", () => addToTeam(pokemon.id));

}



// Gestion de l'affichage des nouveaux Pokémon

loadMoreButton.addEventListener("click", displayNextBatch);



// Fonction pour afficher les détails d'un Pokémon

function showDetails(id) {

    window.location.href = `details.html?id=${id}`;

}


// Fonction pour filtrer les Pokémon en combinant région et type
function applyFilters() {
    const region = regionFilter.value;
    const type = typeFilter.value;

    let filteredPokemon = allPokemon;

    // Filtrage par région
    if (region === "kanto") {
        filteredPokemon = filteredPokemon.filter(p => p.id <= 151);
    } else if (region === "johto") {
        filteredPokemon = filteredPokemon.filter(p => p.id > 151 && p.id <= 251);
    }

    // Filtrage par type
    if (type !== "all") {
        filteredPokemon = filteredPokemon.filter(p => p.types.some(t => t.type.name === type));
    }

    // Affichage des Pokémon filtrés
    pokemonList.innerHTML = "";
    filteredPokemon.forEach(displayPokemon);
}

// Écouteurs pour les filtres
regionFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

// Réinitialisation des filtres
resetFilters.addEventListener("click", () => {
    regionFilter.value = "all";
    typeFilter.value = "all";
    searchBar.value = "";
    pokemonList.innerHTML = "";
    allPokemon.forEach(displayPokemon);
});

// Recherche par nom ou numéro
searchBar.addEventListener("keyup", (e) => {
    const searchText = e.target.value.toLowerCase();
    pokemonList.innerHTML = "";
    allPokemon
        .filter(p => p.name.includes(searchText) || p.id.toString() === searchText)
        .forEach(displayPokemon);
});

// Fonction pour ajouter un Pokémon à l'équipe
function addToTeam(id) {
    const pokemon = allPokemon.find(p => p.id === id);
    if (!pokemon) return;

    // Affiche l'animation de la Pokéball en appelant la fonction pour
    showPokeballAnimation(() => {
        // Ajouter le Pokémon après l'animation
        const teamCard = document.createElement("div");
        teamCard.classList.add("pokemon-card");

        teamCard.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <button class="removeFromTeam">Retirer</button>
        `;

        teamContainer.appendChild(teamCard);

        // Ajout de l'événement pour retirer le Pokémon
        const removeButton = teamCard.querySelector(".removeFromTeam");
        removeButton.addEventListener("click", () => removeFromTeam(id, teamCard));
    });
}
function showPokeballAnimation(callback) {
    const pokeball = document.getElementById("pokeball-animation");
    pokeball.style.display = "block";

    // Attendre la fin de l'animation (800ms) avant d'ajouter le Pokémon
    setTimeout(() => {
        pokeball.style.display = "none";
        if (callback) callback();
    }, 800);
}


// Fonction pour retirer un Pokémon de l'équipe
function removeFromTeam(id, teamCard) {
    teamCard.remove(); // Supprime la carte de l’équipe
}




// Charger les Pokémon au démarrage
fetchPokemon();
