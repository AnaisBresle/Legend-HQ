https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=51.5073219&lon=0.1276474&dt={time}&appid=f23ee9deb4e1a7450f3157c44ed020e1
const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
//adssa
// First, get the latitude and longitude for the city
const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
// https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=f23ee9deb4e1a7450f3157c44ed020e1

// Call getWeather API when the button is clicked 51.5073219 -0.1276474
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
// https://api.openweathermap.org/data/2.5/weather?lat=51.5073219&lon=-0.1276474&appid=f23ee9deb4e1a7450f3157c44ed020e1&units=metric

document.getElementById("fetchRepos").addEventListener("click", onfetchRepos);

function onfetchRepos() {
  const username = document.getElementById("username").value;

  if (username) {
    // GitHub API endpoint for fetching user repositories
    const url = `https://api.github.com/users/${username}/repos`;

    // Make a GET request to the GitHub API
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("GitHub user not found");
        }
        return response.json();
      })
      .then((data) => {
        renderRepos(data);
        renderRepos2(data);
        renderRepos3(data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  } else {
    console.log("Please enter a GitHub username.");
  }
}

const renderRepos = (repos) => {
  const reposListEl = document.getElementById("repos");
  let html = "";

  //TODO what does this line do?
  repos.forEach((repo) => {
    const repoFullName = repo.full_name;

    html += `<li>${repoFullName}</li>`;
  });

  reposListEl.innerHTML = html;
};

const renderRepos2 = (repos) => {
  const reposListEl = document.getElementById("repos2");

  //TODO what does this line do?
  for (let i = 0; i < repos.length; i++) {
    const repoFullName = repos[i].full_name;

    const repoEl = document.createElement("li");
    repoEl.textContent = repoFullName;
    reposListEl.appendChild(repoEl);
  }
};

const renderRepos3 = (repos) => {
  const reposListEl = document.getElementById("repos3");

  // TODO: what does this line do?
  repos.map((repo) => (reposListEl.innerHTML += `<li>${repo.full_name}</li>`));
};
