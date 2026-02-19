const apiKey = "7134d5cea6df48459c17e5825e6d035a";

async function getWeather() {

    const city = document.getElementById("city").value;
    if (!city) 
        return;

    showLoader(true);
    clearError();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayWeather(data);
        changeBackground(data.weather[0].main);
        getForecast(city);

    } catch (error) {
        showError("Invalid city name!");
    }

    showLoader(false);
}

function displayWeather(data) {
    document.getElementById("temp").innerText =
        "Temperature: " + data.main.temp + " °C";

    document.getElementById("condition").innerText =
        "Condition: " + data.weather[0].description;

    document.getElementById("humidity").innerText =
        "Humidity: " + data.main.humidity + "%";

    document.getElementById("icon").src =
        "https://openweathermap.org/img/wn/" +
        data.weather[0].icon + "@2x.png";
}

function changeBackground(weatherType) {
    if (weatherType === "Rain") {
        document.body.style.background =
            "linear-gradient(to right, #373B44, #4286f4)";
    }
    else if (weatherType === "Clear") {
        document.body.style.background =
            "linear-gradient(to right, #fceabb, #f8b500)";
    }
    else if (weatherType === "Clouds") {
        document.body.style.background =
            "linear-gradient(to right, #bdc3c7, #2c3e50)";
    }
    else {
        document.body.style.background =
            "linear-gradient(to right, #4facfe, #00f2fe)";
    }
}

function showLoader(show) {
    document.getElementById("loader").style.display =
        show ? "block" : "none";
}

function showError(message) {
    document.getElementById("error").innerText = message;
}

function clearError() {
    document.getElementById("error").innerText = "";
}

async function getForecast(city) {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    let forecastHTML = "<h3>5 Day Forecast</h3>";

    for (let i = 0; i < data.list.length; i += 8) {
        forecastHTML += `
            <p>
                ${data.list[i].dt_txt.split(" ")[0]} :
                ${data.list[i].main.temp} °C
            </p>
        `;
    }

    document.getElementById("forecast").innerHTML = forecastHTML;
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            const data = await response.json();

            displayWeather(data);
            changeBackground(data.weather[0].main);
        });
    }
}
