const pokemonList = document.querySelector('#pokemonList');
const searchBar = document.querySelector('#searchBar');

// Fonction pour récupérer les données de l'API

async function fetchPokemon() {

    for (let i = 1; i <= 1304; i++) { 
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);

        const pokemon = await res.json();

        displayPokemon(pokemon);

    }

}



// Fonction pour afficher un Pokémon

function displayPokemon(pokemon) {

    const pokemonCard = document.createElement("div");

    pokemonCard.classList.add("pokemon-card");



    pokemonCard.innerHTML = `

        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">

        <h3>${pokemon.name}</h3>

        <p>#${pokemon.id}</p>

        <button class="DetailsPokemon" onclick="showDetails(${pokemon.id})">Détails</button>

    `;



    pokemonList.appendChild(pokemonCard);

}



// Fonction pour afficher les détails

function showDetails(id) {

    window.location.href = `details.html?id=${id}`;

}



// Événement pour la barre de recherche

searchBar.addEventListener("keyup", (e) => {

    const searchText = e.target.value.toLowerCase();

    document.querySelectorAll(".pokemon-card").forEach(card => {

        const name = card.querySelector("h3").textContent;

        card.style.display = name.includes(searchText) ? "block" : "none";

    });

});



// Charger les Pokémon au chargement de la page

fetchPokemon();
