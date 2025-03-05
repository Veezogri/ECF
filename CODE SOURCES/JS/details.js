    const params = new URLSearchParams(window.location.search);
    const pokemonId = params.get("id");

    const pokemonName = document.getElementById("pokemonName");
    const pokemonImage = document.getElementById("pokemonImage");
    const pokemonDescription = document.getElementById("pokemonDescription");
    const pokemonTypes = document.getElementById("pokemonTypes");
    const statsContainer = document.getElementById("statsContainer");
    const evolutionChain = document.getElementById("evolutionChain");
    const goBackButton = document.querySelector('.Retour-Arrière');

    async function fetchPokemonDetails() {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemon = await res.json();

            const speciesRes = await fetch(pokemon.species.url);
            const speciesData = await speciesRes.json();

            // Récupérer la description
            const description = speciesData.flavor_text_entries.find(entry => entry.language.name === "fr");
            pokemonDescription.textContent = description ? description.flavor_text : "Aucune description disponible.";

            // Remplir les informations de base
            pokemonName.textContent = `${pokemon.name} (#${pokemon.id})`;
            pokemonImage.src = pokemon.sprites.other["official-artwork"].front_default;

            // Affichage des types avec couleur spécifique et lien cliquable
            pokemonTypes.innerHTML = "";
            pokemon.types.forEach(t => {
                const typeElement = document.createElement("span");
                typeElement.classList.add("type", t.type.name);
                typeElement.textContent = t.type.name;
                typeElement.addEventListener("click", () => redirectToType(t.type.name));
                pokemonTypes.appendChild(typeElement);
            });

            // Affichage des statistiques avec barres de progression
            statsContainer.innerHTML = pokemon.stats.map(s =>
                `<div class="stat">
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${s.base_stat}%;"><span>${s.stat.name}: ${s.base_stat}</span></div>
                    </div>
                </div>`
            ).join("");

            // Récupérer et afficher les évolutions avec flèches
            await loadEvolutionChain(speciesData.evolution_chain.url);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du Pokémon :", error);
        }
    }

    // Fonction pour récupérer la chaîne d'évolution
    async function fetchEvolutionChain(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            let chain = data.chain;
            let evolutions = [];

            do {
                const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`);
                const pokeData = await pokeRes.json();
                evolutions.push({ name: chain.species.name, id: pokeData.id });
                chain = chain.evolves_to[0];
            } while (chain);

            return evolutions;
        } catch (error) {
            console.error("Erreur lors de la récupération des évolutions :", error);
            return [];
        }
    }

    // Fonction pour afficher les évolutions avec des flèches
    async function displayEvolutionChain(evolutionChainData) {

        evolutionChain.innerHTML = "";
    
    
    
        for (let i = 0; i < evolutionChainData.length; i++) {
    
            const evo = evolutionChainData[i];
    
    
    
            // Création de la carte d'évolution
    
            const evolutionDiv = document.createElement("div");
    
            evolutionDiv.classList.add("evolution");
    
    
    
            const evolutionImg = document.createElement("img");
    
            evolutionImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`;
    
            evolutionImg.alt = evo.name;
    
    
    
            const evolutionName = document.createElement("p");
    
            evolutionName.textContent = evo.name;
    
    
    
            // Barre de progression modernisée
    
            const progressBarContainer = document.createElement("div");
    
            progressBarContainer.classList.add("evolution-progress");
    
    
    
            const progressBar = document.createElement("div");
    
            progressBar.classList.add("progress-bar");
    
            progressBarContainer.appendChild(progressBar);
    
    
    
            evolutionDiv.appendChild(evolutionImg);
    
            evolutionDiv.appendChild(progressBarContainer);
    
            evolutionDiv.appendChild(evolutionName);
    
            evolutionDiv.addEventListener("click", () => redirectToPokemon(evo.id));
    
    
    
            evolutionChain.appendChild(evolutionDiv);
    
    
    
            // Ajout d'une flèche animée entre les évolutions, sauf pour la dernière
    
            if (i < evolutionChainData.length - 1) {
    
                const arrow = document.createElement("span");
    
                arrow.classList.add("evolution-arrow");
    
                arrow.innerHTML = "➜"; // Flèche stylisée
    
                evolutionChain.appendChild(arrow);
    
            }
    
    
    
            // Déclenchement progressif de l'animation
    
            setTimeout(() => {
    
                evolutionDiv.classList.add("show");
    
                progressBar.style.width = "100%";
    
            }, i * 400);
    
        }
    
    }
    

    // Charge et affiche les évolutions
    async function loadEvolutionChain(url) {
        const evolutionData = await fetchEvolutionChain(url);
        displayEvolutionChain(evolutionData);
    }

    // Fonction pour rediriger vers la page d'un Pokémon
    function redirectToPokemon(id) {
        window.location.href = `details.html?id=${id}`;
    }

    // Début de fonction pour rediriger vers la liste des Pokémon d'un type donné, je vais de voir ajouter un listener peut-être mais c'est pas demandé
    function redirectToType(type) {
        window.location.href = `index.html?type=${type}`;
    }

    // Fonction pour revenir en arrière
    function goBack() {
        window.history.back();
    }

    // Ajout de l'événement "Retour"
    if (goBackButton) {
        goBackButton.addEventListener("click", goBack);
    }

    // Charger les détails du Pokémon
    fetchPokemonDetails();

