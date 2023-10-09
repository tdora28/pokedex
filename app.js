const cardContainer = document.querySelector('.cards');
const searchBar = document.querySelector('#search');

console.log(searchBar.value);

let pokeData = [];

const fetchData = async () => {
  await fetch('https://pokeapi.co/api/v2/pokemon?limit=121&offset=0')
    .then((response) => response.json())
    .then((data) => {
      const fetches = data.results.map((item) => {
        return fetch(item.url)
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
        pokeData = res;
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

fetchData();

searchBar.addEventListener('input', (e) => {
  // The "input" event will work also when clearing the searchBar (maybe better than "keyup")
  const searchString = e.target.value.toLowerCase();
  pokeCards(searchString);
});
