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
                    const { temp, feels_like, humidity } = weatherData.main;
                    const { main, description, icon } =  weatherData.weather[0];
                    const wind = weatherData.wind.speed;
                    // const description = weatherData.weather[0].description;
                    const weatherIconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
                    document.querySelector(".todayIcon").src = weatherIconURL;
                    document.querySelector(".mainDescription").textContent = main + " - " + description;
                    document.querySelector(".tempNow").textContent = temp + "°C";
                    document.querySelector(".feel").textContent = feels_like + "°C";
                    document.querySelector(".humidity").textContent = humidity;
                    document.querySelector(".wind").textContent = wind + " mph";

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


