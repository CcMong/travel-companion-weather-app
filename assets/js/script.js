
// Start off by recalling any saved information from local storage when the page is accessed. 

var userSearchHistory; // Variable declared in global scope. 

var parsedSearchHistory = JSON.parse(localStorage.getItem("userSearchHistory")); // Data we get off the local storage is converted to an array that we can work with

if(!parsedSearchHistory) { 

    userSearchHistory = []; // If we get null data from local storage, eg. before any search is conducted, this will simply be an empty array where we will push the user's search into
    
} else {userSearchHistory = parsedSearchHistory; // As long as parsedSearchHistory is not null, userSearchHistory will be set to what comes out of local storage
}

// Function for rendering the search history buttons

function renderSearchHistoryButtons() {

    $("#history").empty(); // Start by emptying the existing history on the page

    
    for (var i = 0; i < userSearchHistory.length; i++) { // Then loop through userSearchHistory array

        if (i > 5) {

            break; // Ensure that, according to the mock-up, only 6 cities appear in the search history

        } else {

            var newHistoryButton = $("<button>")
            .text(userSearchHistory[i])
            .attr("data-city", userSearchHistory[i])
            .addClass("historyBtn btn btn-primary btn-sm col-12"); // ?????

            $("#history").append(newHistoryButton); // We will place the newest city search at the beginning of the array. So we can append here to keep the latest search at the top of the search history stack         

        }
    };
}

// Function to apply title case to a word

function titleCase(x) {
    if(typeof x !== "string") {
        return "";
    } return x.charAt(0).toUpperCase() + x.slice(1);
}

var currentDayForecast = $(".card-content");

var fiveDayForecast = $("#forecast");

const apiKey = config.API_KEY;

var userSearchInput = "";

// Function to Display Weather Data

function displayWeatherData() {

    currentDayForecast.empty();

    fiveDayForecast.empty();    

    // if userSearchInput exists (must get it all in the same form) in the userSearchHistory array, then we want to take the value out and re-place it at the top of the array

    if(userSearchHistory.includes(userSearchInput) == true) {

        // First get the index of the duplicate city value
        var duplicateCityIndex = userSearchHistory.indexOf(userSearchInput);

        // Then splice the value out of the array
        var duplicateCity = userSearchHistory.splice(duplicateCityIndex, 1); // This is actually a one-element array

        console.log(duplicateCity[0]);

        // Lastly, affix it to the beginning of the array
        userSearchHistory.unshift(duplicateCity[0]);

    } else {

        userSearchHistory.unshift(userSearchInput);

    }    

    // Once we have a "valid" array with the user's search input and search history, we set it into local storage to overwrite what was previously there

    localStorage.setItem("userSearchHistory", JSON.stringify(userSearchHistory)); 

    // Then we use the array elements to populate the search history

    renderSearchHistoryButtons();

    // DISPLAY THE CURRENT WEATHER AND FIVE-DAY FORECAST FOR THE userSearchInput
    
    var queryGeoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearchInput}&limit=5&appid=${apiKey}`;

    $.ajax({
        url: queryGeoURL,
        method: "GET",
        }).then(function(geoResponse) {
            //console.log(geoResponse);

            const lat = geoResponse[0].lat;
            const lon = geoResponse[0].lon;

            var queryWeatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            $.ajax({
                url: queryWeatherURL,
                method: "GET",
                }).then(function(weatherResponse) {
                    
                    var forecastList = weatherResponse.list;// This is an array of 40 elements, each for a particular time stamp, over the five days being forecast

                    var currentDayWeather = forecastList[0];

                    var currentTime = currentDayWeather.dt;                  

                    var currentWeatherDate = moment.unix(currentTime).format("DD/MM/YYYY");

                    var currentWeatherIconCode = currentDayWeather.weather[0].icon;

                    var currentWeatherIconURL = `http://openweathermap.org/img/w/${currentWeatherIconCode}.png`;
                   

                    // With the city name, date and weather icon extracted, we can now place them within the HTML

                    var todayTitle = $("<h4>").html(`${userSearchInput} (${currentWeatherDate})`).addClass("title-header");

                    currentDayForecast.prepend(todayTitle);
                    currentDayForecast.append($("<img>").attr("src", currentWeatherIconURL));

                    // We need temperature, windspeed and humidity

                    var currentTemperature = (currentDayWeather.main.temp - 273.15).toFixed(2);

                    //console.log(currentTemperature);

                    currentDayForecast.append($("<p>").html(`Temperature: ${currentTemperature} \u00B0C`));

                    var currentWindSpeed = currentDayWeather.wind.speed;

                    //console.log(currentWindSpeed);

                    currentDayForecast.append($("<p>").html(`Wind Speed: ${currentWindSpeed} KPH`));

                    var currentHumidity = currentDayWeather.main.humidity;

                    //console.log(currentHumidity);

                    currentDayForecast.append($("<p>").html(`Humidity: ${currentHumidity} %`));


        }
    )
};  
