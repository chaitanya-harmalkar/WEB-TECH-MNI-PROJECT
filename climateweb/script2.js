const API_KEY = "82d9b91741fb4f43805104129250911";
const CURRENT_API = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=`;
const HISTORY_API = `http://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=`;

// Helper function to get a date string (YYYY-MM-DD) for 'N' days ago
function getDateNDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// Existing function for Current Weather
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherBox = document.getElementById("weatherBox");
  const trendsBox = document.getElementById("trendsBox"); // Clear trends box too
  const errorMsg = document.getElementById("errorMsg");

  weatherBox.innerHTML = "";
  trendsBox.innerHTML = ""; // Clear the trends box
  errorMsg.textContent = "";

  if (!city) {
    errorMsg.textContent = "Please enter a city name.";
    return;
  }

  try {
    const response = await fetch(CURRENT_API + city + "&aqi=no");
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    const weather = data.current;
    const location = data.location;

    weatherBox.innerHTML = `
      <h2>${location.name}, ${location.country}</h2>
      <img src="https:${weather.condition.icon}" alt="Weather Icon">
      <p><strong>${weather.temp_c}°C</strong> - ${weather.condition.text}</p>
      <p>💧 Humidity: ${weather.humidity}%</p>
      <p>💨 Wind: ${weather.wind_kph} kph</p>
    `;
  } catch (error) {
    errorMsg.textContent = "Error fetching current weather: " + error.message;
  }
}

// NEW FUNCTION for Historical Trends
async function getTrends() {
    const city = document.getElementById("cityInput").value.trim();
    const weatherBox = document.getElementById("weatherBox"); // Clear current box too
    const trendsBox = document.getElementById("trendsBox");
    const errorMsg = document.getElementById("errorMsg");
    
    weatherBox.innerHTML = ""; // Clear the current weather box
    trendsBox.innerHTML = "";
    errorMsg.textContent = "";

    if (!city) {
        errorMsg.textContent = "Please enter a city name to view trends.";
        return;
    }

    // Calculate the start date (7 days ago)
    const startDate = getDateNDaysAgo(7);
    
  
    
    trendsBox.innerHTML = '<h3>Fetching 7-Day History...</h3>';
    
    try {
        let trendsHtml = '<h3>Historical Weather (Last 7 Days)</h3><ul>';
        let allDataFetched = true;
        
        for (let i = 1; i <= 7; i++) {
            const date = getDateNDaysAgo(i); // i=1 is yesterday, i=7 is 7 days ago
            const historyUrl = `${HISTORY_API}${city}&dt=${date}`;
            
            const response = await fetch(historyUrl);
            
            if (!response.ok) {
                // If one day fails, log it but try to continue
                console.error(`Failed to fetch data for ${date}`);
                trendsHtml += `<li class="trend-day"><strong>${date}:</strong> Data Unavailable</li>`;
                allDataFetched = false;
                continue;
            }

            const data = await response.json();
            const dayData = data.forecast.forecastday[0].day;
            
            // Note: The History API gives daily summary data
            trendsHtml += `
                <li class="trend-day">
                    <strong>${date}</strong>: ${dayData.condition.text}<br>
                    Max Temp: ${dayData.maxtemp_c}°C / Min Temp: ${dayData.mintemp_c}°C<br>
                    Avg Humidity: ${dayData.avghumidity}%
                </li>
            `;
        }
        
        trendsHtml += '</ul>';
        trendsBox.innerHTML = trendsHtml;
        if (!allDataFetched) {
             errorMsg.textContent = "Note: One or more days failed to load. This feature may require a higher-tier API plan.";
        }

    } catch (error) {
        // This catches network errors or JSON parsing issues
        errorMsg.textContent = "Error fetching trends data. Check console for details or API key plan.";
        console.error("Trends Error:", error);
        trendsBox.innerHTML = '';
    }
}