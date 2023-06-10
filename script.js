// Global query selectors
const closeSearchButton = document.querySelector("#close-search-btn"); 
const moreMoviesButton = document.querySelector("#load-more-movies-btn");
const moviesGrid = document.querySelector("#movies-grid"); 
const searchForm = document.querySelector("#search-form"); 


// API Call variables
const API_KEY = "feb3a34a2110aba7b17820b5a02d58af"; 
let pagesNum = 0; 


/**
 * Fetches the data for currently playing movies.
 */
const fetchData = async () => {
    pagesNum += 1; 
    const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pagesNum}`;
    const res = await fetch(URL); 
    const data = await res.json();
    makeMovieCards(data.results); 
};


/**
 * Refreshes the page by reloading it.
 */
const refreshPage = () => {
    location.reload(); 
};


/**
 * Fetches the queried movie data based on the search query.
 * @param {Event} query - The event containing the search query.
 */
const fetchQueriedMovieData = async (query) => {
    moviesGrid.innerHTML = ""; 
    const queryText = query.target.query.value; 
    const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${pagesNum}&query=${queryText}`;
    const res = await fetch(URL); 
    const data = await res.json(); 
    pagesNum += 1; 

    // check to see if the query actually returned any results
    if (data.results.length != 0) {
        makeMovieCards(data.results);
    }
    else {
        // if no results found, notify the client and reset the page to the default movies
        alert("No movies found :("); 
        pagesNum = 0; 
        searchForm.reset(); 
        fetchData(); 
    }

    // Add the close search element to the DOM
    makeCloseSearchButton(); 
};


/**
 * Clears the movies grid and fetches the data for currently playing movies.
 */
const clearMoviesGrid = async () => {
    moviesGrid.innerHTML = ""
    pagesNum = 1; 

    const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pagesNum}`;
    const res = await fetch(URL); 
    const data = await res.json(); 

    destoryCloseSearchButton(); 
    makeMovieCards(data.results); 
};


/**
 * Gets the poster path for a movie.
 * @param {Object} movieObject - The movie object.
 * @returns {string} - The poster path for the movie.
 */
const getMoviePosterPath = (movieObject) => {
    // placeholder value for the movie's poster image
    let moviePosterPath = ""; 

    // the image for the movie poster depends on if there is a valid path for the movie poster
    if (movieObject.poster_path) {
        moviePosterPath = `https://image.tmdb.org/t/p/w342${movieObject.poster_path}`; 
    }
    else {
        moviePosterPath = "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"; 
    }

    return moviePosterPath; 
};


/**
 * Creates movie cards and adds them to the main grid.
 * @param {Array} movieObjects - The array of movie objects.
 */
const makeMovieCards = (movieObjects) => {
    movieObjects.forEach(element => {
    
        // Make the div html element for the movie card
        const movieCard = document.createElement("div"); 
        const moviePoster = document.createElement("img"); 
        const movieTitle = document.createElement("h2"); 
        const movieVotes = document.createElement("h3"); 

        // Add the necessary attributes to the created html elements
        movieCard.classList.add("movie-card"); 
        moviePoster.classList.add("movie-card-image"); 
        movieTitle.classList.add("movie-title"); 
        movieVotes.classList.add("movie-votes"); 
        moviePoster.classList.add("movie-poster");

        // Emoji rating for the movie depending on the average votes of the movie
        movieTitle.innerHTML = element.title; 
        const movieVotesValue = element.vote_average; 
        if (movieVotesValue >= 7) {
            movieVotes.innerHTML = `🌟 ${movieVotesValue}`
        }
        else if (movieVotesValue >= 5 && movieVotesValue <= 7) {
            movieVotes.innerHTML = `😬 ${movieVotesValue}`
        }
        else {
            movieVotes.innerHTML = `👎 ${movieVotesValue}`
        }

        moviePoster.src = getMoviePosterPath(element); 
        moviePoster.alt = `Movie poster image for ${element.original_title}`; 

        moviePoster.addEventListener("click", (e) => { makeMoviePopUp(element)}); 

        // add all new html elements to movieCard
        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle); 
        movieCard.appendChild(movieVotes); 

        // Add new movie card to main grid
        moviesGrid.appendChild(movieCard); 
    });
};


/**
 * Fetches the movie URL for a movie.
 * @param {Object} movieObject - The movie object.
 * @returns {string|null} - The movie URL or null if not found.
 */
const fetchMovieURL = async (movieObject) => {
    const movieID = movieObject.id; 
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${API_KEY}`); 
    const data = await res.json(); 

    const movieURL = await data.results[0].key; 
    if (movieURL) {
        return movieURL; 
    }
    else {
        return null; 
    }
};


/**
 * Creates the close search button and adds it to the header container.
 */
const makeCloseSearchButton = () => {
    const headerContainer = document.querySelector(".header-container"); 
    const closeSearchButton = document.createElement("button"); 
    closeSearchButton.setAttribute("id", "close-search-btn"); 
    closeSearchButton.innerHTML = "Reset Search"; 
    closeSearchButton.addEventListener("click", clearMoviesGrid); 
    headerContainer.appendChild(closeSearchButton); 
};


/**
 * Removes the close search button from the header container.
 */
const destoryCloseSearchButton = () => {
    const closeSearchButton = document.querySelector("#close-search-btn"); 
    closeSearchButton.remove(); 
};


/**
 * Removes the movie pop-up card and background.
 */
const destoryMoviePopUp = () => {
    const moviePopUp = document.querySelector(".movie-popup-card"); 
    const moviePopUpCardBackground = document.querySelector(".movie-popup-card-background");
    moviePopUp.remove(); 
    moviePopUpCardBackground.remove(); 
};


/**
 * Creates the movie pop-up card for a movie.
 * @param {Object} movieObject - The movie object.
 */
const makeMoviePopUp = async (movieObject) => {
    
    // Creating all HTML elements needed for the popup card
    const moviePopUpCard = document.createElement("div"); 
    const moviePopUpCardBackground = document.createElement("div"); 
    const moviePopUpVideo = document.createElement("iframe"); 
    const moviePopUpTitle = document.createElement("h2"); 
    const moviePopUpVotes = document.createElement("h4"); 
    const moviePopUpDesc = document.createElement("h3"); 
    const moviePopUpCloseButton = document.createElement("button"); 

    // Setting all of the html attributes to the created html elements
    moviePopUpCard.setAttribute("class", "movie-popup-card");
    moviePopUpCardBackground.classList.add("movie-popup-card-background") 
    moviePopUpVideo.classList.add("movie-popup-video"); 
    moviePopUpTitle.classList.add("movie-popup-title"); 
    moviePopUpVotes.classList.add("movie-popup-votes"); 
    moviePopUpDesc.classList.add("movie-popup-desc"); 
    moviePopUpCloseButton.classList.add("movie-popup-close-button"); 

    // Start setting up all of the needed inner html 
    moviePopUpTitle.innerHTML = movieObject.title; 
    moviePopUpDesc.innerHTML = movieObject.overview; 
    if (movieObject.vote_average >= 7) {
        moviePopUpVotes.innerHTML = `🌟 ${movieObject.vote_average}`
    }
    else if (movieObject.vote_average >= 5 && movieObject.vote_average <= 7) {
        moviePopUpVotes.innerHTML = `😬 ${movieObject.vote_average}`
    }
    else {
        moviePopUpVotes.innerHTML = `👎 ${movieObject.vote_average}`
    }

    moviePopUpCloseButton.innerHTML = "Close Pop Up"; 

    // Getting the movie URL to query for the movie link
    const movieURL = await fetchMovieURL(movieObject); 

    // Setting all attributes for movies
    moviePopUpVideo.src = `https://www.youtube.com/embed/${movieURL}`
    moviePopUpVideo.setAttribute("id", "movie-video");
    moviePopUpVideo.setAttribute("allow", "accelerometer");
    moviePopUpVideo.setAttribute("frameborder", 0); 
    moviePopUpVideo.toggleAttribute("autoplay"); 

    // Add event listiners to pop up elements
    // This lets the user close the pop up different ways
    moviePopUpCardBackground.addEventListener("click", destoryMoviePopUp); 
    moviePopUpCloseButton.addEventListener("click", destoryMoviePopUp); 

    // Add all new html elements to pop up card element
    moviePopUpCard.appendChild(moviePopUpTitle);
    moviePopUpCard.appendChild(moviePopUpVideo);  
    moviePopUpCard.appendChild(moviePopUpDesc); 
    moviePopUpCard.appendChild(moviePopUpVotes); 
    moviePopUpCard.appendChild(moviePopUpCloseButton); 

    // End with appending pop up to main div
    moviesGrid.append(moviePopUpCardBackground); 
    moviesGrid.append(moviePopUpCard); 
};


/**
 * Adds event listeners to the search form, load more movies button, and website header title.
 */
const addEventListeners = () => {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        fetchQueriedMovieData(event); 
    });

    moreMoviesButton.addEventListener("click", fetchData); 

    const websiteHeaderTitle = document.querySelector("h1"); 

    websiteHeaderTitle.addEventListener("click", refreshPage); 
};


window.onload = () => {
    fetchData();
    addEventListeners(); 
};
