
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

