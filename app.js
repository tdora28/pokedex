const cardContainer = document.querySelector(".cards");
const searchBar = document.querySelector("#search");

console.log(searchBar.value);

let pokeData = [];

const fetchData = async () => {
  await fetch("https://pokeapi.co/api/v2/pokemon?limit=121&offset=0")
    .then((response) => response.json())
    .then((data) => {
      const fetches = data.results.map((item) => {
        return fetch(item.url)
          .then((res) => res.json())
          .then((data) => {
            return {
              id: data.id,
              name: data.name,
              img: data.sprites.other["official-artwork"].front_default,
              types: data.types,
            };
          });
      });

      Promise.all(fetches).then((res) => {
        pokeData = res;
        pokeCards("");
      });
    });
};

const pokeCards = (searchString) => {
  const content = pokeData
    .filter((pokemon) => {
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
                  ${tags.join("")}
                </p>
            </div>
        </div>
     `;
    })
    .join("");

  cardContainer.innerHTML = content;
};

fetchData();

searchBar.addEventListener("input", (e) => {
  const searchString = e.target.value;
  pokeCards(searchString);
});
