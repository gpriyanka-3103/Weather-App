const apiKey = '466129b892c63417c39a19f9bbf4cddc';


function getWeather() {
    const cityInput = document.getElementById('city');
    const city = cityInput ? cityInput.value.trim() : '';
    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200" || !data.list) {
                throw new Error(data.message || "Error fetching forecast data.");
            }
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404' || !data.main) {
        weatherInfoDiv.innerHTML = `<p>${data.message || 'City not found.'}</p>`;
        if (weatherIcon) weatherIcon.style.display = 'none';
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        if (weatherIcon) {
            weatherIcon.src = iconUrl;
            weatherIcon.alt = description;
            weatherIcon.style.display = 'block';
        }
    }
}


function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; 

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours().toString().padStart(2, '0');
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item" style="display:inline-block;margin:8px;text-align:center;">
                <span style="display:block;">${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon" style="width:40px;height:40px;">
                <span style="display:block;">${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) weatherIcon.style.display = 'block';
}


document.getElementById('city').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});