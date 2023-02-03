
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
    
    var queryGeoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${userSearchInput}&limit=5&appid=${apiKey}`;

    $.ajax({
        url: queryGeoURL,
        method: "GET",
        }).then(function(geoResponse) {
            //console.log(geoResponse);

            const lat = geoResponse[0].lat;
            const lon = geoResponse[0].lon;

            var queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            $.ajax({
                url: queryWeatherURL,
                method: "GET",
                }).then(function(weatherResponse) {
                    
                    var forecastList = weatherResponse.list;// This is an array of 40 elements, each for a particular time stamp, over the five days being forecast

                    var currentDayWeather = forecastList[0];

                    var currentTime = currentDayWeather.dt;                  

                    var currentWeatherDate = moment.unix(currentTime).format("DD/MM/YYYY"); // Get the date using the unix timestamp

                    var currentWeatherIconCode = currentDayWeather.weather[0].icon;

                    var currentWeatherIconURL = `https://openweathermap.org/img/w/${currentWeatherIconCode}.png`;
                   

                    // With the city name, date and weather icon extracted, we can now place them within the HTML

                    var todayTitle = $("<h4>").html(`${userSearchInput} (${currentWeatherDate})`).addClass("title-header");

                    currentDayForecast.prepend(todayTitle);
                    currentDayForecast.append($("<img>").attr("src", currentWeatherIconURL));

                    // We need temperature, windspeed and humidity. Create p elements, put the info in each, and append to the HTML area

                    var currentTemperature = (currentDayWeather.main.temp - 273.15).toFixed(2);
                    
                    currentDayForecast.append($("<p>").html(`Temperature: ${currentTemperature} \u00B0C`));

                    var currentWindSpeed = currentDayWeather.wind.speed;

                    currentDayForecast.append($("<p>").html(`Wind Speed: ${currentWindSpeed} KPH`));

                    var currentHumidity = currentDayWeather.main.humidity;

                    currentDayForecast.append($("<p>").html(`Humidity: ${currentHumidity} %`));

                    // Now to create the 5-day forecast, we will loop over weatherResponse

                    for (let i = 0; i < 5; i++) {

                        // Create the div element (card) that will contain the weather forecast information
                        var forecastCard = $("<div>").addClass("forecast col p-2 rounded-lg text-white");

                        $("#forecast").append(forecastCard); // Then append it to the forecast area in the HTML

                        var forecastReference = forecastList[(i * 8) + 1]; // We want to target the second element of the 8 provided per day (because the first one was used for current weather conditions) for consistency

                        var forecastDate = moment.unix(forecastReference.dt).format("DD/MM/YYYY");

                        forecastCard.append($("<h5>").html(forecastDate));

                        // Get the forecast weather icon, put it in an img element and append to respective card

                        var forecastIconCode = forecastReference.weather[0].icon;

                        var forecastIconURL = `https://openweathermap.org/img/w/${forecastIconCode}.png`;

                        forecastCard.append($("<img>").attr("src", forecastIconURL));

                        var forecastTemp = (forecastReference.main.temp - 273.15).toFixed(2); // Convert to Celsius and round to two decimal places

                        forecastCard.append($("<p>").html(`Temp: ${forecastTemp} \u00B0C`));

                        var forecastWindSpeed = (forecastReference.wind.speed);

                        forecastCard.append($("<p>").html(`Wind: ${forecastWindSpeed} KPH`));

                        var forecastHumidity = forecastReference.main.humidity;

                        forecastCard.append($("<p>").html(`Humidity: ${forecastHumidity} %`));   

                    };             
                });            
        });    
};


// Add a click event listener to add a user search term to the beginning of the search history array, and to create the respective button

$("#search-button").on("click", function(event) {

    event.preventDefault();

    userSearchInput = titleCase($("#search-input").val().trim()); // Makes the search title case before it is manipulated further

    displayWeatherData();    
});


// Add an event listener so that, if a user clicks on one of the search history buttons, it will also display the information for the respective city

$(document).on("click", ".historyBtn", function(event) {

    event.preventDefault();

    userSearchInput = titleCase($(this).attr("data-city"));

    displayWeatherData();    
})


// Add an event listener to the Clear Search History button, which clears local storage and the rendered buttons

$("#clear-button").on("click", function(event) {

    event.preventDefault();

    window.localStorage.clear();

    location.reload();
})

renderSearchHistoryButtons(); // We want to call this function as standard when the page is loaded. At the start, we check if there is any historical search data in local storage. If there is, then the array is parsed. And calling this function will display all the buttons according to the elements in the array.


