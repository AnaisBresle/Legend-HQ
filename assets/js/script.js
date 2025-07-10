const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1"; // just going to leave version 2.5 in this sctipt. it still uses it to get long lat
const API_KEY_V3 = "2735674da0bee9978cdc75bac162d6ef"; // Dan's openweathermap account api key (for ver 3.0)
// https://api.openweathermap.org/data/3.0/onecall?lat=51.5073219&lon=-0.1276474&exclude=current&appid=2735674da0bee9978cdc75bac162d6ef

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
                // 2.5: const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
                const part = ""; //"minutely, hourly, alerts"; // exclude options
                const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY_V3}`;
                console.log(weatherUrl);
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
                    // Version 2.5:
                    // const { temp, feels_like, humidity } = weatherData.current;                   
                    // const { temp, feels_like, humidity } = weatherData.main;
                    // const { main, description, icon } =  weatherData.weather[0];
                    // const {sunrise, sunset} = weatherData.sys;
                    // const wind = weatherData.wind.speed;
                    // const weatherIconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
                    // const timezoneOffset = weatherData.timezone; // from API
                    // const localTimeStr = getLocalTimeFromOffset(timezoneOffset);
                    // const sunriseFormatted = formatTime(sunrise, timezoneOffset);
                    // const sunsetFormatted = formatTime(sunset, timezoneOffset);
                    const {
                        temp,
                        feels_like,
                        humidity,
                        sunrise,
                        sunset,
                        wind_speed,
                        weather
                    } = weatherData.current; 
                    //tempReal = roundDownOneDecimalPlace(temp)    
                    const { main, description, icon } = weather[0];
                    const weatherIconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                    // const timezoneOffset = getCurrentOffsetInSeconds(weatherData.timezone);
                    // const localTimeStr = getLocalTimeFromOffset(timezoneOffset);
                    const timezoneName = weatherData.timezone;
                    const localTimeStr = getLocalTimeFromTimezoneName(weatherData.current.dt, timezoneName);
                    const sunriseFormatted = formatTime(sunrise, timezoneName);
                    const sunsetFormatted = formatTime(sunset, timezoneName);
                    // display the today forecast section
                    document.querySelector("#todayForecast").classList.remove("hidden"); 
                    document.querySelector("#fiveDayForecast").classList.remove("hidden");                 
                    const iconContainerEl = document.querySelector(".col-12.col-md-4.d-flex.justify-content-center.align-items-center");
                    if (icon.endsWith("d")) {
                        iconContainerEl.classList.remove("bg-dark");
                        iconContainerEl.style.backgroundColor = "skyblue";
                    } else {
                        iconContainerEl.classList.add("bg-dark");
                        iconContainerEl.style.backgroundColor = "";
                    }
                    document.querySelector(".timeStamp").textContent = "Local time: " + localTimeStr;
                    document.querySelector(".todayIcon").src = weatherIconURL;
                    document.querySelector(".mainDescription").textContent = main + " - " + description;
                    document.querySelector(".tempNow").textContent = fixTemp(temp) ;
                    document.querySelector(".feel").textContent = fixTemp(feels_like);
                    document.querySelector(".humidity").textContent = humidity + "%";
                    document.querySelector(".wind").textContent = wind_speed + " kph";
                    document.querySelector(".sunrise").textContent = sunriseFormatted;
                    document.querySelector(".sunset").textContent = sunsetFormatted;
                    
                    // 6-day forcast
                    const dayWords = ["One", "Two", "Three", "Four", "Five", "Six"];
                    let sixDays = weatherData.daily.slice(1, 7); // get first 6 elements of array
                    for (let i = 0; i < sixDays.length; i++) {
                        const day = sixDays[i];
                        const dayWord = dayWords[i]; // one, two etc.
                        const dayEl = document.querySelector("#day" + dayWord);
                        const dayNameEl =  dayEl.querySelector(".pt-3");
                        const highEl = dayEl.querySelector(".tempHigh");
                        const lowEl = dayEl.querySelector(".tempLow");
                        const iconEl = dayEl.querySelector(".weatherIcon");
                        const sixDayLabel = format6DayDate(day.dt, timezoneName);
                        dayNameEl.textContent = sixDayLabel
                        const icon = day.weather[0].icon;
                        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                        highEl.textContent = fixTemp(day.temp.max);
                        lowEl.textContent = fixTemp(day.temp.min);
                        iconEl.src = iconURL;
                    }

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
function fixTemp(apiTemp) {
    return Math.floor(apiTemp / 10) + "°C";
}

// Datetime conversion functions using timezone name
function formatTime(timestamp, timezoneName) {
    const date = new Date(timestamp * 1000);
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezoneName,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    return formatter.format(date);
}

function format6DayDate(timestamp, timezoneName) {
    const date = new Date(timestamp * 1000);
    const day = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezoneName,
        day: 'numeric'
    }).format(date);

    const weekday = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezoneName,
        weekday: 'long'
    }).format(date);

    const suffix = getDateSuffix(Number(day));
    return `${weekday} ${day}${suffix}`;
}
function getDateSuffix(n) {
    if (n % 10 === 1 && n !== 11) return 'st';
    if (n % 10 === 2 && n !== 12) return 'nd';
    if (n % 10 === 3 && n !== 13) return 'rd';
    return 'th';
}
function getLocalTimeFromTimezoneName(timestamp, timezoneName) {
    const date = new Date(timestamp * 1000);

    return date.toLocaleString("en-GB", {
        timeZone: timezoneName,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}




// // Fix for DST issue with the timezone off-set
// function getCurrentOffsetInSeconds(timezoneName) {
   
//     const now = new Date();
//     // Get the current local time in the target timezone
//     const localTime = new Date(now.toLocaleString('en-GB', { timeZone: timezoneName }));
//     // Offset = local time - UTC time (in milliseconds)
//     const offsetMs = localTime.getTime() - now.getTime();
//     // Convert to seconds
//     return Math.round(offsetMs / 1000);
// }

// function formatTime(timestamp, timezoneOffset) {
//     const localDate = new Date((timestamp + timezoneOffset) * 1000);
//     const hours = String(localDate.getHours()).padStart(2, '0');
//     const minutes = String(localDate.getMinutes()).padStart(2, '0');
//     return `${hours}:${minutes}`;
// }

// function format6DayDate(timestamp, timezoneOffset) {
//     const localDate = new Date((timestamp + timezoneOffset) * 1000);
//     const day = localDate.getUTCDate();
//     const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' }).format(localDate);
//     const suffix = getDateSuffix(day);
//     return `${weekday} ${day}${suffix}`;
// }


// function getLocalTimeFromOffset(timezoneOffset,) {
//     // this date format function uses toLocaleString method
//     const nowUTC = new Date();
//     // Create new time adjusted by the timezone offset
//     const localTime = new Date(nowUTC.getTime() + timezoneOffset * 1000);
//     console.log("localTime: " + localTime)
    
//     // Long date format: Tuesday, 2 July 2025 – 16:45
//     options = {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//     };
//     return localTime.toLocaleString("en-GB", options);
// }