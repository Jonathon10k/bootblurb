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
    let queryURL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY_GOOGLE}&num=10&cx=${CUSTOM_SE}&q=${searchQuery}`;

    fetch(queryURL)
        .then(response => response.json())
        .then(googleData => processCardData(googleData))
        .catch(error => console.error("Error:", error));
}


// Process Google Custom Search data and render to Blurb card
function processCardData(data) {


    // Create an array of results sans Google metadata
    let resultItems = [ ...data.items ];

    // Identify individual query source and send item to renderCard()

    resultItems.forEach(resultItem => {
        let site = resultItem.displayLink;

        if (site.includes("w3schools")) {
            renderCard(resultItem, "w3s");
        } else if (site.includes("freecodecamp")) {
            renderCard(resultItem, "fcc");
        } else if (site.includes("mozilla")) {
            renderCard(resultItem, "mdn");

        }
    });
}

// Render query result to blurb card
function renderCard(result, id) {
    let title = document.querySelector(`.card-${id}-title`);
    let p = document.querySelector(`.card-${id}-p`)
    title.textContent = result.title;
    p.textContent = `"${result.snippet}"`;

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
    "HTML",
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
