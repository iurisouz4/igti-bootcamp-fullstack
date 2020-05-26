let users = null;
let searchButton = null;
let searchInput = null;
let usersList = null;
let statsList = null;

window.addEventListener("load", async () => {
  // prettier-ignore
  const res = await fetch("https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo");
  const json = await res.json();
  users = json.results.map((user) => {
    return {
      name: `${user.name.first} ${user.name.last}`,
      gender: user.gender,
      avatar: user.picture.thumbnail,
      age: user.dob.age,
    };
  });
  console.log(users);

  searchButton = document.querySelector("#search-button");
  searchInput = document.querySelector("#search-input");
  usersList = document.querySelector("#list-users");
  statsList = document.querySelector("#list-stats");

  searchButton.addEventListener("click", search);
  searchInput.addEventListener("input", () => {
    searchButton.disabled = searchInput.value.trim() != "" ? false : true;
  });
  searchInput.addEventListener("keyup", function (e) {
    var key = e.which || e.keyCode;
    if (key == 13) {
      !searchButton.disabled && search();
    }
  });

  usersList.innerHTML = '<h2 class="title is-2">Nenhum usuário filtrado</h2>';
  statsList.innerHTML = '<h2 class="title is-2">Nada a ser exibido</h2>';
});

function search() {
  // filter users
  const filtered = users
    .filter((user) => {
      return user.name.toLowerCase().includes(searchInput.value.toLowerCase());
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (filtered.length > 0) {
    usersList.innerHTML = "";
    let userlisthtml = `<h2 class="title is-2">${filtered.length} usuário(s) encontrado(s)</h2>`;
    filtered.forEach((user) => {
      userlisthtml += `<div class="box">
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img
                  class="is-rounded"
                  src="${user.avatar}"
                  alt="Image"
                />
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>${user.name}</strong>
                  <br />
                  ${user.age} anos
                </p>
              </div>
            </div>
          </article>
        </div>`;
    });
    usersList.innerHTML = userlisthtml;

    // calculate stats
    const totalMale = filtered.filter((user) => user.gender === "male").length;
    const totalFemale = filtered.filter((user) => user.gender === "female")
      .length;
    const sumAge = filtered.reduce((acm, user) => acm + user.age, 0);
    const averageAge = (sumAge / filtered.length || 0).toFixed(2);
    statsList.innerHTML = `<h2 class="title is-2">Estatísticas</h2>
        <h2>Sexo masculino: <strong>${totalMale}</strong></h2>
        <h2>Sexo feminino: <strong>${totalFemale}</strong></h2>
        <h2>Soma das idades: <strong>${sumAge}</strong></h2>
        <h2>Média das idades: <strong>${averageAge}</strong></h2>`;
  } else {
    usersList.innerHTML = '<h2 class="title is-2">Nenhum usuário filtrado</h2>';
    statsList.innerHTML = '<h2 class="title is-2">Nada a ser exibido</h2>';
  }
}
