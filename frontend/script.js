const BACKEND_URL = "http://localhost:3000"

async function searchJokes() {
    const query = document.getElementById("search-query").value;
    const response = await fetch(`${BACKEND_URL}/search-jokes?query=${query}`);
    const jokes = await response.json();
    displayJokes(jokes);
}

async function favouriteJoke(jokeId, jokeText) {
    console.log(jokeId, jokeText);
    await fetch(`${BACKEND_URL}/favourite-joke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jokeId, jokeText }),
    });
    const favouriteJoke = document.getElementById(`favouriteJoke${jokeId}`);
    favouriteJoke.innerText = "Added!"
    favouriteJoke.classList.remove("btn-dark");
    favouriteJoke.classList.add("btn-success");
}

function displayJokes(jokes) {
  const container = document.getElementById("jokes-container");
  container.innerHTML = "";
  jokes.forEach((joke) => {
    const jokeCardWrap = document.createElement("div");
    jokeCardWrap.className = "col align-items-stretch"
    const jokeCard = document.createElement("div");
    jokeCard.className = "card border rounded-3 shadow-sm mb-3 p-4 h-100";
    jokeCard.innerHTML = `<p class="fw-medium">${joke.joke}</p><button id="favouriteJoke${joke.id}" class="btn btn-dark mt-auto" onclick="favouriteJoke('${joke.id}', '${joke.joke.replaceAll("'", "&#x2019")}')">Favourite</button>`;
    container.appendChild(jokeCardWrap).appendChild(jokeCard);
  });
}

async function loadFavourites() {
  const response = await fetch(`${BACKEND_URL}/favourite-jokes`);
  const favourites = await response.json();
  displayFavourites(favourites);
}

function displayFavourites(favourites) {
  const container = document.getElementById("favourites-container");
  container.innerHTML = "";
  favourites.forEach((favourite) => {
    const jokeCardWrap = document.createElement("div");
    jokeCardWrap.className = "col align-items-stretch"
    const jokeCard = document.createElement("div");
    jokeCard.className = "card border rounded-3 shadow-sm mb-3 p-4 h-100";
    jokeCard.innerHTML = `<p>${favourite.jokeText}</p>`;
    container.appendChild(jokeCardWrap).appendChild(jokeCard);
  });
}

// Load favourites on page load if on favourites page
if (document.getElementById("favourites-container")) {
  loadFavourites();
}
