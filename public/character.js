//pull the url string from after the domain to get the genre and setting 
const params = new URLSearchParams(window.location.search);
const genre = params.get("genre");
const setting = params.get("setting");

//keep the chosen options in the form so they are included when the user submits their character
document.getElementById("genre").value = genre;
document.getElementById("setting").value = setting;

//show the user which genre and setting they are building their story around
document.getElementById("storyDetails").textContent = `Genre: ${genre} | Setting: ${setting}`;

//use the server to pick a title that matches the users chosen genre/ setting
async function loadStoryTitle() {
    const titleDisplay = document.getElementById("storyTitle");
    const titleInput = document.getElementById("storyTitleInput");

    try {
        //pass the selected options to the server so it knows which titles to choose from
        const query = new URLSearchParams({
            genre: genre || "",
            setting: setting || ""
        });

        //fetch the title without reloading the rest of character page
        const response = await fetch(`/api/story-title?${query}`);

        // if it is not a 200 status throw this error
        if (!response.ok) {
            throw new Error("Could not load a story title.");
        }

        //read the title returned by the server as json
        const data = await response.json();

        //show the title and save it in the form so the same title is submitted with the character info
        titleDisplay.textContent = data.title;
        titleInput.value = data.title;

    } catch (error) {
        //show the error if the title request fails but allows the rest of the page to still display 
        console.error("Error loading story title:", error);
        titleDisplay.textContent = "Your story title could not be loaded. Please try again.";
    }
}

//choose the first title automatically when the user opens the character page
loadStoryTitle();

//get the button the user can click if they want a different title
const refreshTitleButton = document.getElementById("refreshTitle");

//reuse the same function to load another title instead of writing the request a second time
refreshTitleButton.addEventListener("click", () => {
    loadStoryTitle();
});