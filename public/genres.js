//new concept i researched because i wanted genre selection to feel more like browsing through books instead of clicking regular buttons
//https://swiperjs.com/swiper-api#coverflow-effect
const genreSwiper = new Swiper(".genre-swiper", {
    //picked thr coverflow effect as it looked closet to my vision of it moving it a 3d book look, and the selected genre standing out from the others
    effect: "coverflow",
    //make the current selection in the center to show which genre your on 
    centeredSlides: true,
    //let each slide use its own width so the 3d layout can show parts of the other genre cards beside the selected one
    slidesPerView: "auto",
    //default is true but when i added more then 3 genres the effect would jump in a werird order
    //turned loop off but rewind on so when you get to the end it will jump back to the start 
    loop: false,
    rewind: true,

    //setting the 3d effect so the side cards angle away from the selected genre
    coverflowEffect: {
        //angle the of the noncentered card
        rotate: 30,
        //wanted the cards to appear as close as possible to look like they are fliping like a book
        stretch: 0,
        //control how far the side cards appear behind the selected card
        depth: 100,
        //adjust how strongly the rotate, stretch and depth settings affect the overall effect
        modifier: 1,
        //default is true and i dont like the look 
        slideShadows: false
    },

    //connect swiper to the next and previous arrows in genres.html so the user can browse genres using the buttons
    //https://swiperjs.com/swiper-api#navigation
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },

    //add clickable dots below the carousel so the user can jump directly to a genre
    //https://swiperjs.com/swiper-api#pagination
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    }
});

//get the button the user clicks after choosing which genre they want to write about
const chooseGenreButton = document.getElementById("chooseGenre");

chooseGenreButton.addEventListener("click", () => {
    //get the slide currently selected in swiper, rather than assuming the user chose a specific card
    const activeSlide = genreSwiper.slides[genreSwiper.activeIndex];
    //read the genre stored on that slide's data genre attribute, (curent options romance/mystery/fanasty/dysopian)
    const selectedGenre = activeSlide.dataset.genre;
    //send the selected genre to the existing express route, which checks it and redirects the user to the character page with the genre's default setting
    window.location.href = `/story/${selectedGenre}`;
});
