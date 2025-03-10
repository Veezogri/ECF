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
        window.location.href = "CODESOURCES/HTML/compare.html"; // ça me redirige vers la page de comparaison
    }
});

loadMoreButton.id = "loadMore";

maincontainer.appendChild(loadMoreButton);



let allPokemon = []; // Stocke tous les Pokémon pour le filtrage

let displayedPokemonCount = 0; // Compteur de Pokémon affichés

const batchSize = 20;
let isFiltering = false; // Nombre de Pokémon affichés à la fois

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
        loadMoreButton.style.display = "none"; // Cache le bouton quand tout est affiché
    }
}




// Fonction pour afficher un Pokémon sous forme de carte

function displayPokemon(pokemon) {
     //  Exclure les formes spéciales avec un ID > 1304
     if (pokemon.id > 1304) {
        return;
    }

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

        <div class="button-container">
            <button class="AddToTeam">
                <i class="fas fa-user-plus"></i>
                <span class="button-text">Ajouter à mon équipe</span>
            </button>
            <button class="ComparePokemon" data-id="${pokemon.id}">
                <i class="fas fa-balance-scale"></i>
                <span class="button-text">Comparer</span>
            </button>
        </div>
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

    window.location.href = `CODESOURCES/HTML/details.html?id=${id}`;

}

async function applyFilters() {
    isFiltering = true;
    pokemonList.innerHTML = ""; // Efface la liste pour afficher les résultats filtrés
    loadMoreButton.style.display = "none"; // Cache le bouton "Afficher plus"

    const searchText = searchBar.value.toLowerCase();
    const region = regionFilter.value;
    const type = typeFilter.value;

    let url = `https://pokeapi.co/api/v2/pokemon?limit=1304`; // On récupère tous les Pokémon pour le filtrage

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Récupération des détails pour chaque Pokémon
        const pokemonDetailsPromises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
        });

        const allPokemon = await Promise.all(pokemonDetailsPromises);

        // Appliquer les filtres après récupération des données
        let filteredPokemon = allPokemon;

        // Filtrage par région
        if (region === "kanto") {
            filteredPokemon = filteredPokemon.filter(p => p.id <= 151);
        } else if (region === "johto") {
            filteredPokemon = filteredPokemon.filter(p => p.id > 151 && p.id <= 251);
        } else if (region === "hoenn") {
            filteredPokemon = filteredPokemon.filter(p => p.id > 251 && p.id <= 386);
        }

        // Filtrage par type
        if (type !== "all") {
            filteredPokemon = filteredPokemon.filter(p => p.types.some(t => t.type.name === type));
        }

        //  Filtrage par recherche (nom ou ID)
        if (searchText) {
            filteredPokemon = filteredPokemon.filter(p =>
                p.name.includes(searchText) || p.id.toString() === searchText
            );
        }
        
        

        //  Affichage des Pokémon filtrés
        if (filteredPokemon.length > 0) {
            filteredPokemon.forEach(displayPokemon);
            document.getElementById("noResultsMessage").style.display = "none"; // Cacher message d'erreur
        } else {
            document.getElementById("noResultsMessage").style.display = "block"; // Afficher message d'erreur
        }
    } catch (error) {
        console.error("Erreur lors du filtrage des Pokémon :", error);
    }
}

// Réinitialisation des filtres
resetFilters.addEventListener("click", () => {
    searchBar.value = "";
    regionFilter.value = "all";
    typeFilter.value = "all";
    isFiltering = false; // Désactive le mode filtrage
    pokemonList.innerHTML = ""; // Efface la liste actuelle
    displayedPokemonCount = 0; // Remet le compteur à zéro
    fetchPokemon(); // Recharge les Pokémon de base
    loadMoreButton.style.display = "block"; // Réaffiche le bouton "Afficher plus"
});

//  Appliquer les filtres en temps réel
searchBar.addEventListener("keyup", applyFilters);
regionFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

// Charger les premiers Pokémon au démarrage
fetchPokemon();




const notificationContainer = document.createElement("div");
notificationContainer.id = "notification-container";
document.body.appendChild(notificationContainer);

function showNotification(message, success = true) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    if (success) {
        notification.classList.add("success");
    } else {
        notification.classList.add("error");
    }
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Fonction pour ajouter un Pokémon à l'équipe
function addToTeam(id) {
    let team = JSON.parse(localStorage.getItem("pokemonTeam")) || [];

    if (team.some(pokemon => pokemon.id === id)) {
        showNotification("Ce Pokémon est déjà dans votre équipe !", false);
        return; 
    }

    const pokemon = allPokemon.find(p => p.id === id);
    if (!pokemon) return;

    // Cache la liste et le bouton "Afficher plus" pendant l'animation
    loadMoreButton.style.display = "none";
    showPokeballAnimation(() => {
        team.push({
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default
        });

        localStorage.setItem("pokemonTeam", JSON.stringify(team));
        showNotification(`${pokemon.name} a été ajouté à votre équipe !`);

        // Réaffiche la liste après l'animation
        pokemonList.innerHTML = ""; // On vide la liste
        displayedPokemonCount = 0;  // On remet le compteur à zéro
        fetchPokemon();  // On recharge les Pokémon
    });
}

function showPokeballAnimation(callback) {
    const pokeball = document.getElementById("pokeball-animation");

    // Masque la liste et le bouton "Afficher plus" pour voir uniquement l'animation
    pokemonList.style.display = "none";
    loadMoreButton.style.display = "none"; // Cache le bouton "Afficher plus"

    pokeball.style.display = "block";

    setTimeout(() => {
        pokeball.style.display = "none";

        // Réaffiche la liste après l'animation
        pokemonList.style.display = "grid"; // On remet l'affichage normal
        loadMoreButton.style.display = "block"; // On remet le bouton "Afficher plus"

        if (callback) callback();
    }, 1500); // Durée de l'animation (ajuste si nécessaire)
}


// Fonction pour retirer un Pokémon de l'équipe
function removeFromTeam(id, teamCard) {
    teamCard.remove(); // Supprime la carte de l’équipe
}




