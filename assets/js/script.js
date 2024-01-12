// ** BootBlurb MVP logic - J.E. 1/2024 ** //

let searchBtn = document.querySelector(".search-btn");
let searchBox = document.querySelector(".form-control");
let footer = document.querySelector("footer");
let savedUL = document.querySelector(".saved-ul");
let savedCards = [];

// ** Fetch code ** //

// (Currently separated for readability/debugging but could be refactored for DRY)

// Fetch Google result data and pass to processCardData function (uses Google Custom Search Engine API)
function googleFetch(inputQuery) {

    const API_KEY_GOOGLE = "AIzaSyBHtvodXNu1cIM_x7uofj7DM3IrxeczpNY";
    const CUSTOM_SE = "c5d5fca43c5174c62";
    let searchQuery = inputQuery;
    let queryURL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY_GOOGLE}&cx=${CUSTOM_SE}&q=${searchQuery}`;

    fetch(queryURL)
        .then(response => response.json())
        .then(googleData => processCardData(googleData))
        .catch(error => console.error("Error:", error));
}

// Fetch repo data from GitHub API and pass to processor function
function stackFetch(inputQuery) {

    let searchQuery = inputQuery;
    const queryURL = `https://api.stackexchange.com/2.3/search?order=desc&sort=activity&intitle=${searchQuery}&site=stackoverflow`;
    fetch(queryURL)
        .then(response => response.json())
        .then(gitData => renderStackData(gitData))
        .catch(error => console.error("Error:", error))
}

// ** End Fetch code ** //

// Process Google Custom Search data and render to Blurb card
function processCardData(data) {

    // Create an array of results sans Google metadata (reverse to get most relevant results)
    // Reverse() to get most relevant (Refactor when time allows!)
    let resultItems = [...data.items].reverse();

    // Identify individual query source and send item to renderCard()
    resultItems.forEach(resultItem => {
        let site = resultItem.displayLink;

        if (site.includes("w3schools")) {
            renderCard(resultItem, "w3s");
        } else if (site.includes("mozilla")) {
            renderCard(resultItem, "mdn");
        }
    });
}

// Render query result to blurb card
function renderCard(result, id) {

    let title = document.querySelector(`.card-${id}-title`);
    let p = document.querySelector(`.card-${id}-p`)
    let link = document.querySelector(`.${id}-link`);
    title.textContent = result.title;
    p.textContent = `"${result.snippet}"`;
    link.setAttribute("href", result.link);
}

// Render SO data to card ('first, make it work...')
function renderStackData(data) {

    let title = document.querySelector(".card-so-title");
    let p = document.querySelector(".card-so-p");
    let link = document.querySelector(".so-link");

    title.textContent = `Q:"${data.items[0].title.slice(0, 70)}..."`;
    p.textContent = `Tags: ${data.items[0].tags.join(', ')}`;
    link.setAttribute("href", data.items[0].link)

}

// Search button event listener (refactor with delegation)
searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") {
        googleFetch(searchBox.value);
        stackFetch(searchBox.value);
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
            stackFetch(e.target.textContent);
        });
    });
}

// Save card info to localStorage (in future refactor to validate/check for duplication)

let saveBtns = document.querySelectorAll(".save-btn");

saveBtns.forEach(btn => {

    btn.addEventListener("click", function (e) {
        let theCard = this.closest(".result-card"); // Get closest card to click target
        let cardTitle = theCard.querySelector(".card-title").textContent;
        let cardURL = theCard.querySelector(".btn-link").getAttribute("href");
        let saveDate = new Date();

        // Trigger button animation
        savedAnim(e.target);

        // Store in object and push to savedCards array
        if (cardTitle !== "") {
            let cardData = {
                title: cardTitle,
                url: cardURL,
                date: saveDate.toLocaleDateString("en-GB"),
            };
            // Push new object to savedCards array
            savedCards.push(cardData);

            // Add array to LS
            localStorage.setItem("savedCards", JSON.stringify(savedCards));

        } else {
            console.log("Error: this is a save about nothing!");
            // Refactor: add visual alert
        }
    });
});

// Animate card save button on click (remove after 2 secs)
function savedAnim(elem) {

    let icon = elem.querySelector("img");
    icon.classList.add("success");
    // Remove class after 2 secs
    setTimeout(() => {
        icon.classList.remove("success");
    }, 2000);
}

// Load saved card data from localStorage (Refactor: render to actual cards)
function loadSaved() {
    savedUL.innerHTML = ""; // Blank UL

    let restoredCards = JSON.parse(localStorage.getItem("savedCards"));

    restoredCards.forEach(item => {

        let newItem = document.createElement("li");
        newItem.innerHTML = `Date: ${item.date} Title: ${item.title} - URL: <a href="${item.url}">Click to visit!</a>`;

        savedUL.appendChild(newItem);

    });

}

// Initial suggestion bubbles render
renderQueryBubbles();
