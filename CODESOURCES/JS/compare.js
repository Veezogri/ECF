document.addEventListener("DOMContentLoaded", async() => {
    const pokemon2Select = document.getElementById("pokemon2Select");
    const compareButton = document.getElementById("compareButton");
    const pokemon1Box = document.getElementById("pokemon1");
    const pokemon2Box = document.getElementById("pokemon2");
    let allPokemon = [];
    const selectedPokemonId = localStorage.getItem("comparePokemon1");
    if (!selectedPokemonId) {
        alert("Veuillez d'abord sélectionner un Pokémon !");
        window.location.href = "index.html";
        return;
    }
    async function fetchAllPokemon() {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1304`);
            const data = await res.json();
            allPokemon = data.results;
            populateSelectMenu();
        } catch (error) {
            console.error("Erreur lors du chargement des Pokémon :", error);
        }
    }

    function populateSelectMenu() {
        allPokemon.forEach((pokemon) => {
            const option = document.createElement("option");
            option.value = pokemon.name;
            option.textContent = pokemon.name;
            pokemon2Select.appendChild(option);
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
    const pokemon1 = await fetchPokemonDetails(selectedPokemonId);
    displayPokemon(pokemon1Box, pokemon1);
    async function comparePokemon() {
        const pokemon2Name = pokemon2Select.value;
        if (!pokemon2Name) {
            alert("Veuillez sélectionner un Pokémon à comparer !");
            return;
        }
        const pokemon2 = await fetchPokemonDetails(pokemon2Name);
        displayPokemon(pokemon2Box, pokemon2);
        highlightBetterStats(pokemon1, pokemon2);
    }

    function displayPokemon(container, pokemon) {
        const types = pokemon.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(" ");
        container.innerHTML = ` <h2>${pokemon.name} (#${pokemon.id})</h2>
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        <div class="types">${types}</div>
            <div class="stats">
                ${pokemon.stats.map(s => ` <div class="stat">
                <span class="stat-name">${s.stat.name}</span>
                    <div class="stat-bar">
                        <div class="stat-fill ${s.stat.name}" data-value="${s.base_stat}" style="width: ${s.base_stat}%">
                    </div>
                <span class="stat-value">${s.base_stat}</span>
            </div>
        </div> `).join("")}
        </div> `; } 
        
        function highlightBetterStats(pokemon1, pokemon2) {
            const stats1 = pokemon1.stats; 
            const stats2 = pokemon2.stats; 
            stats1.forEach((stat, index) => { 
                const statName = stat.stat.name; 
                const stat1Value = stat.base_stat; 
                const stat2Value = stats2[index].base_stat; 
                const bar1 = pokemon1Box.querySelector(`.stat-fill.${statName}`); 
                const bar2 = pokemon2Box.querySelector(`.stat-fill.${statName}`); 
                if (stat1Value > stat2Value) { bar1.classList.add("winner"); 
                    bar2.classList.add("loser"); } 
                    else if (stat2Value > stat1Value) { 
                        bar2.classList.add("winner"); 
                        bar1.classList.add("loser"); } 
                        else { bar1.classList.remove("winner", "loser"); 
                                bar2.classList.remove("winner", "loser"); 
                            } 
                        }); 
                    } 
                    compareButton.addEventListener("click", comparePokemon); fetchAllPokemon(); });