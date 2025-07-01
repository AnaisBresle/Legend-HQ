https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=51.5073219&lon=0.1276474&dt={time}&appid=f23ee9deb4e1a7450f3157c44ed020e1
const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
//adssa
// First, get the latitude and longitude for the city
const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
// https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=f23ee9deb4e1a7450f3157c44ed020e1

// Call getWeather API when the button is clicked 51.5073219 -0.1276474
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
// https://api.openweathermap.org/data/2.5/weather?lat=51.5073219&lon=-0.1276474&appid=f23ee9deb4e1a7450f3157c44ed020e1&units=metric
