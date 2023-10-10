const cardContainer = document.querySelector('.cards');
const searchBar = document.querySelector('#search');
const genBtns = document.querySelectorAll('.gen-btn');
const genInfo = document.querySelector('#genInfo');

let pokeData = [];

const fetchData = async (generation) => {
  await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`)
    .then((response) => response.json())
    .then((data) => {
      const fetches = data.pokemon_species.map((item) => {
        let searchNum = item.url.replace('https://pokeapi.co/api/v2/pokemon-species/', '');

        return fetch(`https://pokeapi.co/api/v2/pokemon/${searchNum}`)
          .then((res) => res.json())
          .then((data) => {
            return {
              id: data.id,
              name: data.name,
              img: data.sprites.other['official-artwork'].front_default,
              types: data.types,
              height: data.height,
              weight: data.weight,
            };
          });
      });

      Promise.all(fetches).then((res) => {
        pokeData = res.sort((a, b) => {
          return a.id - b.id;
        });
        const numOfPokemonInGen = res.length;
        genInfo.textContent = `There are ${numOfPokemonInGen} pokemon in Generation ${generation}`;
        pokeCards('');
      });
    });
};

const pokeCards = (searchString) => {
  const content = pokeData
    .filter((pokemon) => {
      // If searchString === "", it will return every pokemon
      return pokemon.name.includes(searchString);
    })
    .map((pokemon) => {
      let tags = pokemon.types.map((item) => {
        return `<span class="tag ${item.type.name}">${item.type.name}</span>`;
      });

      return `
        <div class="card">
            <p class="card__id">#${pokemon.id}</p>
            <div class="card__img">
                <img src=${pokemon.img} alt="Pikachu" />
            </div>
            <div class="card__info">
                <h3 class="card__title">${pokemon.name}</h3>
                <p class="card__tags">
                  ${tags.join('')}
                </p>
                <p class="card__measurements">
                <span>Height: ${(pokemon.height / 10).toFixed(1)} m</span>
                <span>Weight: ${(pokemon.weight / 10).toFixed(1)} kg</span>
                </p>
            </div>
        </div>
     `;
    })
    .join('');

  cardContainer.innerHTML = content;
};

genBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    genBtns.forEach((btn) => {
      btn.classList.remove('selected');
    });
    e.target.classList.add('selected');

    const genNum = e.target.dataset.gen;
    fetchData(genNum);

    searchBar.classList.add('show');
  });
});

searchBar.addEventListener('input', (e) => {
  // The "input" event will work also when clearing the searchBar (maybe better than "keyup")
  const searchString = e.target.value.toLowerCase();
  pokeCards(searchString);
});
