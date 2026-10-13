const params = new URLSearchParams(window.location.search);

const genre = params.get("genre");
const setting = params.get("setting");

// Put the existing choices into the hidden form fields.
document.getElementById("genre").value = genre;
document.getElementById("setting").value = setting;

// Show the user which story they are creating.
document.getElementById("storyDetails").textContent = `Genre: ${genre} | Setting: ${setting}`;


    // Request a random story title from the Express server.
async function loadStoryTitle() {
    const titleDisplay = document.getElementById("storyTitle");
    const titleInput = document.getElementById("storyTitleInput");

    try {
        // Send the selected genre and setting to the server.
        const query = new URLSearchParams({
            genre: genre || "",
            setting: setting || ""
        });

        const response = await fetch(`/api/story-title?${query}`);

        // Check whether the server returned an error.
        if (!response.ok) {
            throw new Error("Could not load a story title.");
        }

        // Convert the JSON response into a JavaScript object.
        const data = await response.json();

        // Display the title and save it in the form.
        titleDisplay.textContent = data.title;
        titleInput.value = data.title;

    } catch (error) {
        console.error("Error loading story title:", error);
        titleDisplay.textContent = "Your story title could not be loaded. Please try again.";
    }
}

// Load the title when the character page opens.
loadStoryTitle();

// Find the button that lets the user choose another title.
const refreshTitleButton = document.getElementById("refreshTitle");

// Request another title when the button is clicked.
refreshTitleButton.addEventListener("click", () => {
    loadStoryTitle();
});