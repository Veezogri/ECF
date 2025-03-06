const pokemon2Select = document.getElementById("pokemon2Select");
const compareButton = document.getElementById("compareButton");
const pokemon1Box = document.getElementById("pokemon1");
const pokemon2Box = document.getElementById("pokemon2");
let allPokemon = [];
const pokemon1Select = document.getElementById("pokemon1");
if (localStorage.getItem("comparePokemon1")) {
    pokemon1Select.value = localStorage.getItem("comparePokemon1");
    localStorage.removeItem("comparePokemon1");
    async function fetchAllPokemon() {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1304`);
            const data = await res.json();
            allPokemon = data.results;
            populateSelectMenus();
        } catch (error) {
            console.error("Erreur lors du chargement des Pokémon :", error);
        }
    }

    function populateSelectMenus() {
        allPokemon.forEach((pokemon) => {
            const option1 = document.createElement("option");
            option1.value = pokemon.name;
            option1.textContent = pokemon.name;
            pokemon1Select.appendChild(option1);
            const option2 = document.createElement("option");
            option2.value = pokemon.name;
            option2.textContent = pokemon.name;
            pokemon2Select.appendChild(option2);
        });
    }
    async function fetchPokemonDetails(name) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            return res.json();
        } catch (error) {
            console.error(`Erreur lors de la récupération de ${name} :`, error);
        }
    }
    async function comparePokemon() {
        const pokemon1Name = pokemon1Select.value;
        const pokemon2Name = pokemon2Select.value;
        if (!pokemon1Name || !pokemon2Name) {
            alert("Veuillez sélectionner deux Pokémon !");
            return;
        }
        const pokemon1 = await fetchPokemonDetails(pokemon1Name);
        const pokemon2 = await fetchPokemonDetails(pokemon2Name);
        displayComparison(pokemon1, pokemon2);
    }

    function displayComparison(pokemon1, pokemon2) {
        pokemon1Box.innerHTML = generatePokemonHTML(pokemon1);
        pokemon2Box.innerHTML = generatePokemonHTML(pokemon2);
    }

    function generatePokemonHTML(pokemon) {
        const types = pokemon.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(" ");
        return ` <h2>${pokemon.name} (#${pokemon.id})</h2> <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}"> <div class="types">${types}</div> <div class="stats"> ${pokemon.stats.map(s => ` <div class="stat"> <span class="stat-name">${s.stat.name}</span> <div class="stat-bar"> <div class="stat-fill ${s.stat.name}" style="width: ${s.base_stat}%;"></div> <span class="stat-value">${s.base_stat}</span> </div> </div> `).join("")} </div> `; } 
        compareButton.addEventListener("click", comparePokemon);
            fetchAllPokemon();
    }