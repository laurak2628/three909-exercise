
const genreSwiper = new Swiper(".genre-swiper", {
    // Displays the previous and next slides beside the active slide.
    effect: "coverflow",

    // Keeps the selected slide in the centre.
    centeredSlides: true,

    // Allows the user to move between slides.
    slidesPerView: "auto",

    // Makes the carousel loop continuously.
    loop: false,
    rewind: true,


    // Adds the 3D Coverflow appearance.
    coverflowEffect: {
        rotate: 25,
        stretch: 0,
        depth: 150,
        modifier: 1,
        slideShadows: false
    },

    // Connects the arrows in genres.html to Swiper.
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },

    // Connects the pagination dots in genres.html to Swiper.
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    }
});

// Find the button the user presses after choosing a genre.
const chooseGenreButton = document.getElementById("chooseGenre");

chooseGenreButton.addEventListener("click", () => {
    /*Read the active slide's data-genre attribute. For example: data-genre="romance"*/
    const activeSlide = genreSwiper.slides[genreSwiper.activeIndex];
    const selectedGenre = activeSlide.dataset.genre;

    // Navigate to the existing Express route for that genre.
    window.location.href = `/story/${selectedGenre}`;
});
