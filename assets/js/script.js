const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
// DOM Elements
const searchInputEl = document.querySelector(".search-input");
document.querySelector(".search-button").addEventListener("click", onfetchWeather);
searchInputEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        onfetchWeather();
    }
});
function onfetchWeather() {
    const city = searchInputEl.value.trim();
    if (city){
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        fetch(geoUrl)
        .then((response) => {
            if (!response.ok) {
            throw new Error("City not found");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                console.log("No city found.");
            } else {
                document.querySelector(".searchCity").textContent = data[0].name + ", " + data[0].country
                const { lat, lon, name, country } = data[0]; // this is known as: object destructuring
                console.log(`City: ${name}, Country: ${country}, Lat: ${lat}, Lon: ${lon}`);
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
                 // Fetch weather using lat & lon
                fetch(weatherUrl)
                .then((response) => {
                    if (!response.ok) {
                    throw new Error("Weather data not available");
                    }
                    return response.json();
                })
                .then((weatherData) => {
                    console.log(weatherData);
                    // Show the today forecast section
                    document.querySelector("#todayForecast").classList.remove("hidden");
                    
                    const { temp, feels_like, humidity } = weatherData.main;
                    const { main, description, icon } =  weatherData.weather[0];
                    const {sunrise, sunset} = weatherData.sys;
                    const wind = weatherData.wind.speed;
                    const weatherIconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
                    const timezoneOffset = weatherData.timezone; // from API
                    const localTimeStr = getLocalTimeFromOffset(timezoneOffset);
                    const sunriseFormatted = formatTime(sunrise, timezoneOffset);
                    const sunsetFormatted = formatTime(sunset, timezoneOffset);
                    const iconContainer = document.querySelector(".col-12.col-md-4.d-flex.justify-content-center.align-items-center");
                    if (icon.endsWith("d")) {
                        iconContainer.classList.remove("bg-dark");
                        iconContainer.style.backgroundColor = "skyblue";
                    } else {
                        iconContainer.classList.add("bg-dark");
                        iconContainer.style.backgroundColor = "";
                    }
                    document.querySelector(".timeStamp").textContent = "Local time: " + localTimeStr;
                    document.querySelector(".todayIcon").src = weatherIconURL;
                    document.querySelector(".mainDescription").textContent = main + " - " + description;
                    document.querySelector(".tempNow").textContent = temp + "°C";
                    document.querySelector(".feel").textContent = feels_like + "°C";
                    document.querySelector(".humidity").textContent = humidity + "%";
                    document.querySelector(".wind").textContent = wind + " mph";
                    document.querySelector(".sunrise").textContent = sunriseFormatted;
                    document.querySelector(".sunset").textContent = sunsetFormatted;
                })
                .catch((error) => {
                    console.error("Error:", error.message);
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error.message);
        });
    } else {
        console.log("Please enter a City.");
    }
}
function formatTime(timestamp, timezoneOffset) {
  const localDate = new Date((timestamp + timezoneOffset) * 1000);
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
function getLocalTimeFromOffset(timezoneOffsetInSeconds) {
  // Get current time in UTC (in milliseconds)
  const nowUTC = new Date();
  // Create new time adjusted by the timezone offset
  const localTime = new Date(nowUTC.getTime() + timezoneOffsetInSeconds * 1000);
  // Format it nicely (e.g., "Tuesday, 2 July 2025 – 16:45")
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return localTime.toLocaleString("en-GB", options);
}