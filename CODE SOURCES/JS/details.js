const params = new URLSearchParams(window.location.search);

const pokemonId = params.get("id");

const pokemonDetails = document.getElementById("pokemonDetails");



async function fetchPokemonDetails() {

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);

    const pokemon = await res.json();



    pokemonDetails.innerHTML = `

        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">

        <h2>${pokemon.name} (#${pokemon.id})</h2>

        <p>Type: ${pokemon.types.map(t => t.type.name).join(", ")}</p>

        <p>Poids: ${pokemon.weight / 10} kg</p>

        <p>Taille: ${pokemon.height / 10} m</p>

    `;

}



// Fonction pour revenir à l'accueil

function goBack() {

    window.history.back();

}



fetchPokemonDetails();