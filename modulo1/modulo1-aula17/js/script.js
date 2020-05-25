let countries = null;
let favorites = [];
let countcountries = null;
let countcountriesfav = null;
let countpopulation = null;
let countpopulationfav = null;
let listcountries = null;
let listfavorites = null;
const numberformat = Intl.NumberFormat("pt-BR");

window.addEventListener("load", async () => {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const json = await res.json();
  countries = await json.map((country) => {
    return {
      id: country.numericCode,
      name: country.translations.br,
      flag: country.flag,
      population: country.population,
    };
  });

  //countries.find((country) => country.name == "Kosovo").id = 0666;
  console.log(countries);
  countcountries = document.querySelector("#count-countries");
  countcountriesfav = document.querySelector("#count-countries-fav");
  countpopulation = document.querySelector("#count-population");
  countpopulationfav = document.querySelector("#count-population-fav");
  listcountries = document.querySelector("#list-countries");
  listfavorites = document.querySelector("#list-favorites");

  populate();
  refreshData();
});

function refreshData() {
  const totalCountries = countries.length;
  // prettier-ignore
  const totalPopulation = countries.reduce((acm, country) => acm + country.population,0);
  const totalCountriesFav = favorites.length;
  // prettier-ignore
  const totalPopulationFav = favorites.reduce((acm, country) => acm + country.population,0);
  countcountries.innerHTML = `Países: <strong>(${totalCountries})</strong>`;
  countpopulation.innerHTML = `População: <strong>(${numberformat.format(
    totalPopulation
  )})</strong>`;
  countcountriesfav.innerHTML = `Países: <strong>(${totalCountriesFav})</strong>`;
  countpopulationfav.innerHTML = `População: <strong>(${numberformat.format(
    totalPopulationFav
  )})</strong>`;
}

function populate() {
  listcountries.innerHTML = "";
  listfavorites.innerHTML = "";

  let lstcountries = "";
  countries
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((country) => {
      const { id, name, flag, population } = country;
      lstcountries += `<div class="card">
    <div class="card-content">
      <div class="media">
        <button class="button is-primary" id=${id}>+</button>
        <div class="media-left">
            <figure class="image is-96x96">
                <img class="is-square" src="${flag}">
              </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${name}</p>
          <p class="subtitle is-8">${numberformat.format(population)}</p>
        </div>
      </div>
    </div>
  </div>`;
    });

  let lstfavorites = "";
  favorites
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((country) => {
      const { id, name, flag, population } = country;
      lstfavorites += `<div class="card">
    <div class="card-content">
      <div class="media">
        <button class="button is-danger" id=${id}>-</button>
        <div class="media-left">
            <figure class="image is-96x96">
                <img class="is-square" src="${flag}">
              </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${name}</p>
          <p class="subtitle is-8">${numberformat.format(population)}</p>
        </div>
      </div>
    </div>
  </div>`;
    });

  listcountries.innerHTML = lstcountries;
  listfavorites.innerHTML = lstfavorites;
  addHandlers();
}

function addHandlers() {
  const addButtons = Array.from(listcountries.querySelectorAll(".button"));
  const removeButtons = Array.from(listfavorites.querySelectorAll(".button"));

  addButtons.forEach((btn) =>
    btn.addEventListener("click", () => clickAdd(btn.id))
  );
  removeButtons.forEach((btn) =>
    btn.addEventListener("click", () => clickRemove(btn.id))
  );
}

function clickAdd(id) {
  const countryToAdd = countries.find((country) => country.id == id);
  favorites = [...favorites, countryToAdd];
  countries = countries.filter((country) => country.id != id);
  //console.log(favorites);
  populate();
  refreshData();
}

function clickRemove(id) {
  const countryToRemove = favorites.find((country) => country.id == id);
  countries = [...countries, countryToRemove];
  favorites = favorites.filter((country) => country.id != id);
  populate();
  refreshData();
}
