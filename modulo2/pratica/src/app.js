const fs = require("fs").promises;
let states = null;

async function init() {
  console.log("1. Creating States JSONs");
  await createStates();
  const biggestStates = await getFiveStates(false);
  const printbiggestStates = biggestStates.map(
    (state) => `${state.Sigla} - ${state.Cidades}`
  );
  console.log(printbiggestStates);
  const smallestStates = await getFiveStates(true);
  const descSmallestStates = smallestStates.sort((a, b) => {
    return b.Cidades - a.Cidades;
  });
  const printSmallestStates = smallestStates.map(
    (state) => `${state.Sigla} - ${state.Cidades}`
  );
  console.log(printSmallestStates);
  await getCityNamesArray(false);
  await getCityNamesArray(true);
  await getCityName(false);
  await getCityName(true);
}

async function createStates() {
  try {
    cities = JSON.parse(await fs.readFile("./data/Cidades.json", "utf8"));
    states = JSON.parse(await fs.readFile("./data/Estados.json", "utf8"));

    states.forEach(async (state) => {
      const filteredCities = cities.filter((city) => city.Estado === state.ID);
      await fs.writeFile(
        `./data/Estados/${state.Sigla}.json`,
        JSON.stringify(filteredCities)
      );
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function getCities(UF) {
  const arr = await fs.readFile(`./data/Estados/${UF}.json`, "utf8");
  const cities = JSON.parse(arr);
  return cities;
}

async function getTotalCities(UF) {
  const arr = await fs.readFile(`./data/Estados/${UF}.json`, "utf8");
  const cities = JSON.parse(arr);
  return cities.length;
}

async function getFiveStates(asc) {
  let sortedStates = await Promise.all(
    states.map(async (state) => {
      return {
        ID: state.ID,
        Sigla: state.Sigla,
        Nome: state.Nome,
        Cidades: await getTotalCities(state.Sigla),
      };
    })
  );
  sortedStates.sort(function (a, b) {
    if (asc) {
      return a.Cidades - b.Cidades;
    }
    return b.Cidades - a.Cidades;
  });
  return sortedStates.slice(0, 5);
}

async function getCityNamesArray(smallest) {
  let citiesArr = [];
  for (const state of states) {
    const cities = await getCities(state.Sigla);
    let sortedCities = cities.sort((a, b) => {
      if (smallest) {
        return a.Nome.length - b.Nome.length;
      }
      return b.Nome.length - a.Nome.length;
    });
    sortedCities = sortedCities.slice(0, 1).sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    });
    citiesArr.push(
      sortedCities.map((city) => `${city.Nome} - ${state.Sigla}`)[0]
    );
  }

  console.log(citiesArr);
  return citiesArr;
}

async function getCityName(smallest) {
  let citiesArr = [];
  for (const state of states) {
    const cities = await getCities(state.Sigla);
    let sortedCities = cities.sort((a, b) => {
      if (smallest) {
        return a.Nome.length - b.Nome.length;
      }
      return b.Nome.length - a.Nome.length;
    });
    sortedCities = sortedCities.slice(0, 1).sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    });
    citiesArr.push({ ...sortedCities[0], Sigla: state.Sigla });
  }

  citiesArr = citiesArr.sort((a, b) => {
    if (smallest) {
      return a.Nome.length - b.Nome.length;
    }
    return b.Nome.length - a.Nome.length;
  });
  citiesArr = citiesArr.slice(0, 10).sort((a, b) => {
    return a.Nome.localeCompare(b.Nome);
  });

  console.log(citiesArr.map((city) => `${city.Nome} - ${city.Sigla}`)[0]);
}

init();
