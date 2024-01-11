let searchBtn = document.querySelector(".search-btn");
let searchBox = document.querySelector(".form-control");
let footer = document.querySelector("footer");

// ** API code ** //

// (Currently separated for readability/debugging but could be refactored for DRY)

// Fetch Google result data and pass to renderBlurb function (uses Google Custom Search Engine API)
function googleFetch(inputQuery) {
    const API_KEY_GOOGLE = "AIzaSyBHtvodXNu1cIM_x7uofj7DM3IrxeczpNY";
    const CUSTOM_SE = "c5d5fca43c5174c62";
    let searchQuery = inputQuery;
    let queryURL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY_GOOGLE}&cx=${CUSTOM_SE}&q=${searchQuery}`;

    fetch(queryURL)
        .then(response => response.json())
        .then(googleData => renderGoogleCard(googleData))
        .catch(error => console.error("Error:", error));
}


// Process Google Custom Search data and render to Blurb card
function renderGoogleCard(data) {
    let card = document.querySelectorAll(".card-body");
    let theCard = card[0];
    let theData = data.items[1].snippet;
    theCard.innerHTML = theData;
    //console.log(data)
    let cseResults = { ...data.items };
    console.log("new obj:", cseResults)
}

// Search button event listener (refactor with delegation)
searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") {
        googleFetch(searchBox.value);
        searchBox.value = "";
    }
});

// Search suggestions that appear under search bar (in a full version, these would be module-specific)
let bubblesContainer = document.querySelector(".bubbles-container");

let querySuggestions = [
    "JS Objects",
    "JS Arrays",
    "JS Functions",
    "Git",
];

function renderQueryBubbles() {

     // Loop over the query suggestions array and render clickable 'bubbles'
    querySuggestions.forEach(query => {

        let bubble = document.createElement("span");
        bubble.classList.add("bubble", "badge", "bg-light");
        bubble.textContent = query;

        bubblesContainer.appendChild(bubble);

        // Add event listener to trigger API search
        bubble.addEventListener("click", (e) => {
            googleFetch(e.target.textContent);
            console.log("Clicked:", e.target.textContent);
        });
    });
}

renderQueryBubbles();
