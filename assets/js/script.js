
// Start off by recalling any saved information from local storage when the page is accessed. 

var userSearchHistory; // Variable declared in global scope. 

var parsedSearchHistory = JSON.parse(localStorage.getItem("userSearchHistory")); // Data we get off the local storage is converted to an array that we can work with

if(!parsedSearchHistory) { 

    userSearchHistory = []; // If we get null data from local storage, eg. before any search is conducted, this will simply be an empty array where we will push the user's search into
    
} else {userSearchHistory = parsedSearchHistory; // As long as parsedSearchHistory is not null, userSearchHistory will be set to what comes out of local storage
}