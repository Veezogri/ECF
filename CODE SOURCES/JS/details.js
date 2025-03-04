const params = new URLSearchParams(window.location.search);

const pokemonId = params.get("id");

const pokemonDetails = document.getElementById("Card-Details");



async function fetchPokemonDetails() {

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);

    const pokemon = await res.json();
    const types = pokemon.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(" ");
    const stats = pokemon.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join("");
    const evolutionChain = await fetchEvolutionChain(pokemon.species.url);
    const Descriptiondiv = document.querySelector('#Description');
    Descriptiondiv.innerHTML = `<p>Poids: ${pokemon.weight / 10} kg</p> <p>Taille: ${pokemon.height / 10} m</p>`;
    const statsdiv = document.querySelector('#Stats');
    statsdiv.innerHTML = `<h3>Statistiques :</h3> <ul>${stats}</ul>`;
    



    pokemonDetails.innerHTML = ` <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}"> <h2>${pokemon.name} (#${pokemon.id})</h2> <p>Type: ${types}</p>  `;


}


async function fetchEvolutionChain(speciesUrl) {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();
    const evolutionUrl = speciesData.evolution_chain.url;
    const evolutionRes = await fetch(evolutionUrl);
    const evolutionData = await evolutionRes.json();
    let chain = evolutionData.chain;
    let evolutions = [];
    do {
        evolutions.push(chain.species.name);
        chain = chain.evolves_to[0];
    } while (chain);
    return evolutions.length > 1 ? evolutions.join(" → ") : "Aucune évolution";
}



// Fonction pour revenir à l'accueil

function goBack() {

    window.history.back();

}



fetchPokemonDetails();