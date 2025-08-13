    /*------- Weather Application-------*/
 
    const apiKey = "8e06b23219e9223d29199ee4450c9bdc";

     // Dynamically change background color based on temperature
    function changeBackground(temp) {
      if (temp < 10) {
        document.body.style.backgroundColor = "#00aaff"; // Cold
      } else if (temp < 25) {
        document.body.style.backgroundColor = "#ffd166"; // Warm
      } else {
        document.body.style.backgroundColor = "#ef476f"; // Hot
      }
    }

     // Display weather data on the page
    function displayWeather(data) {
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const loc = data.name;
      const iconCode = data.weather[0].icon;
      const iconUrl ='../images/weaatherIcon.png'

      document.getElementById("location").textContent = loc;
      document.getElementById("temperature").textContent = `Temperature: ${temp}°C`;
      document.getElementById("description").textContent = `Condition: ${desc}`;
      document.getElementById("weatherIcon").src = iconUrl;

      changeBackground(temp);
    }

    // Fetch and display 5-day forecast for a city
    function fetchForecast(city) {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const daily = {};

          // Pick one data point per day
          data.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!daily[date]) daily[date] = item;
          });

          const forecastDiv = document.getElementById("forecast");
          forecastDiv.innerHTML = "";

           // Display first 5 days
          Object.keys(daily).slice(0, 5).forEach(date => {
            const day = daily[date];
            const icon = day.weather[0].icon;
            const temp = day.main.temp;

            forecastDiv.innerHTML += `
              <div class="day">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" />
                <p>${temp}°C</p>
              </div>
            `;
          });
        })
        .catch(err => console.log("Forecast error", err));
    }

    // Fetch weather based on coordinates
    function fetchWeather(lat, lon) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(res => res.json())
        .then(data => displayWeather(data))
        .catch(err => console.error("Weather error:", err));
    }

    // Search by city name entered by user
    function searchCity() {
      const city = document.getElementById("cityInput").value.trim();
      
      //const place = document.getElementById("cityInput").placehol
      if (!city) 
        {
           document.getElementById("ErrorMsg").textContent = "! Please enter a location to display 5-day forecast for a city";
           document.getElementById("forecast").innerHTML = "";
           return;
        }
        document.getElementById("ErrorMsg").textContent = "";

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Please enter a location for display 5-day forecast for a city");
          return res.json();
        })
        .then(data => {
          displayWeather(data);
          fetchForecast(city);
        })

         // Handle invalid city
        .catch(err => {
          document.getElementById("location").textContent = "City not found.";
          document.getElementById("temperature").textContent = "";
          document.getElementById("description").textContent = "";
          document.getElementById("forecast").innerHTML = "";
          document.body.style.backgroundColor = "#999";
        });
    }

    // Get user's geolocation and fetch weather
    function getLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(lat, lon);
          },
          () => {
            document.getElementById("location").textContent = "Location access denied.";
          }
        );
      } else {
        document.getElementById("location").textContent = "Geolocation not supported.";
      }
    }

     // Toggle between dark and light themes
    // document.getElementById("toggleTheme").addEventListener("click", () => {
    //   document.body.classList.toggle("dark");
    // });

     // Load weather for current location on page load
    getLocationWeather();

    /*-------End Weather Application-------*/
