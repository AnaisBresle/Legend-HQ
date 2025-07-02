// https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=51.5073219&lon=0.1276474&dt={time}&appid=f23ee9deb4e1a7450f3157c44ed020e1
//const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

// First, get the latitude and longitude for the city
//const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
// https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=f23ee9deb4e1a7450f3157c44ed020e1

//const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
// https://api.openweathermap.org/data/2.5/weather?lat=51.5073219&lon=-0.1276474&appid=f23ee9deb4e1a7450f3157c44ed020e1&units=metric

// DOM Elements
// const addTaskEl = document.getElementById("add-task");
// const taskTableBodyEl = document.querySelector(".task-table tbody");
const searchInputEl = document.querySelector(".search-input");

const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

document.querySelector(".search-button").addEventListener("click", onfetchWeather);

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
                // const cityHedaderEl = document.querySelector(".searchCity");
                // cityHedaderEl.textContent = data[0].name + ", " + data[0].country
                document.querySelector(".searchCity").textContent = data[0].name + ", " + data[0].country
                // alert(data[0].country);
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
                    console.log(weatherData); // Here’s your actual weather info
                    const temp = weatherData.main.temp;
                    const feels_like = weatherData.main.feels_like;
                    const humidity = weatherData.main.humidity;
                    
                    const wind = weatherData.wind.speed;
                    const description = weatherData.weather[0].description;
                    document.querySelector(".tempNow").textContent = temp + "°C"
                    document.querySelector(".feel").textContent = feels_like + "°C"
                    document.querySelector(".humidity").textContent = humidity
                    document.querySelector(".wind").textContent = wind + "mph"
                    
                    //alert(`Current temperature: ${temp}°C\nConditions: ${description}`);
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


