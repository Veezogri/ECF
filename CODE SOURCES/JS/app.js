const pokemonList = document.querySelector("#pokemonList");

const searchBar = document.querySelector("#searchBar");

const regionFilter = document.querySelector("#regionFilter");

const typeFilter = document.querySelector("#typeFilter");

const resetFilters = document.querySelector("#resetFilters");

const loadMoreButton = document.createElement("button");
const maincontainer = document.querySelector("#MainContainer");

loadMoreButton.textContent = "Afficher plus de Pokémon";

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("ComparePokemon")) {
        const selectedPokemonId = e.target.getAttribute("data-id");
        localStorage.setItem("comparePokemon1", selectedPokemonId);
        window.location.href = "compare.html"; // Redirige vers la page de comparaison
    }
});

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
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${batchSize}&offset=${displayedPokemonCount}`);
        const data = await res.json();

        const pokemonDetailsPromises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
        });

        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        allPokemon.push(...pokemonDetails); // Stocker les Pokémon récupérés

        displayNextBatch(); // Afficher les Pokémon récupérés
    } catch (error) {
        console.error("Erreur lors du chargement des Pokémon :", error);
    }
}



// Fonction pour afficher un lot de Pokémon

function displayNextBatch() {
    const nextBatch = allPokemon.slice(displayedPokemonCount, displayedPokemonCount + batchSize);
    
    nextBatch.forEach(displayPokemon);
    
    displayedPokemonCount += batchSize;

    if (displayedPokemonCount >= 1304) {
        loadMoreButton.style.display = "none"; // Cacher le bouton quand tout est affiché
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
        <button class="ComparePokemon" data-id="${pokemon.id}">Comparer</button>

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

loadMoreButton.addEventListener("click", () => {
    fetchPokemon();
});




// Fonction pour afficher les détails d'un Pokémon

function showDetails(id) {

    window.location.href = `details.html?id=${id}`;

}


// Fonction pour filtrer les Pokémon en combinant région et type
function applyFilters() {
    const searchText = searchBar.value.toLowerCase();
    const region = regionFilter.value;
    const type = typeFilter.value;

    // Filtrer tous les Pokémon (pas seulement ceux affichés)
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

    // Filtrage par recherche (nom ou numéro)
    if (searchText) {
        filteredPokemon = filteredPokemon.filter(p =>
            p.name.includes(searchText) || p.id.toString() === searchText
        );
    }

    // Affichage des Pokémon filtrés
    pokemonList.innerHTML = "";

    if (filteredPokemon.length > 0) {
        filteredPokemon.forEach(displayPokemon);
        document.getElementById("noResultsMessage").style.display = "none"; // Cacher le message d'erreur
    } else {
        document.getElementById("noResultsMessage").style.display = "block"; // Afficher le message d'erreur
    }
}

// Appliquer les filtres et recherche en temps réel
regionFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
searchBar.addEventListener("keyup", applyFilters);

// Réinitialisation des filtres
resetFilters.addEventListener("click", () => {
    regionFilter.value = "all";
    typeFilter.value = "all";
    searchBar.value = "";
    document.getElementById("noResultsMessage").style.display = "none"; // Cacher le message d'erreur
    pokemonList.innerHTML = "";
    allPokemon.slice(0, displayedPokemonCount).forEach(displayPokemon);
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
    // Récupérer les Pokémon déjà enregistrés dans localStorage
    let team = JSON.parse(localStorage.getItem("pokemonTeam")) || [];

    // Vérifier si le Pokémon est déjà dans l'équipe (éviter les doublons)
    if (team.some(pokemon => pokemon.id === id)) {
        alert("Ce Pokémon est déjà dans votre équipe !");
        return;
    }

    // Trouver le Pokémon dans la liste
    const pokemon = allPokemon.find(p => p.id === id);
    if (!pokemon) return;

    // Ajouter le Pokémon à l'équipe
    team.push({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.front_default
    });

    // Sauvegarder l'équipe mise à jour dans localStorage
    localStorage.setItem("pokemonTeam", JSON.stringify(team));

    // Afficher un message de confirmation
    alert(`${pokemon.name} a été ajouté à votre équipe !`);
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
