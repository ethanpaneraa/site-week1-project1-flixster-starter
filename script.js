// Global query selectors
const closeSearchButton = document.querySelector("#close-search-btn"); 
const moreMoviesButton = document.querySelector("#load-more-movies-btn");
const moviesGrid = document.querySelector("#movies-grid"); 
const searchForm = document.querySelector("#search-form"); 


// API Call variables
const API_KEY = "feb3a34a2110aba7b17820b5a02d58af"; 
let pagesNum = 0; 
const ADUTL_MEDIA = false;
// const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pagesNum}`;


const fetchData = async () => {
    
    pagesNum += 1; 
    const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pagesNum}`;
    const res = await fetch(URL); 
    const data = await res.json();
    makeMovieCards(data.results); 

};

const fetchQueriedMovieData = async (query) => {
    // Make sure that query is valid
    moviesGrid.innerHTML = ""; 
    if (query) {
        const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${pagesNum}&query=${query.target.query.value}`;
        const res = await fetch(URL); 
        const data = await res.json(); 
        pagesNum += 1; 
        makeMovieCards(data.results)
    }

    else {
        fetchData(); 

    }
};

const clearMoviesGrid = async () => {
    moviesGrid.innerHTML = ""
    pagesNum = 1; 

    const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pagesNum}`;
    const res = await fetch(URL); 
    const data = await res.json(); 

    makeMovieCards(data.results); 

}

const getMoviePosterPath = (movieObject) => {
    // placeholder value for the movies poster image
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

// responsible for creating new movie cards and adding them to the main grid
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

        // Setting the adding movie information to created html elements
        movieTitle.innerHTML = element.original_title; 
        movieVotes.innerHTML = element.vote_average;
        moviePoster.src = getMoviePosterPath(element); 
        moviePoster.alt = `Movie poster image for ${element.original_title}`; 


        movieCard.addEventListener("click", (e) => { makeMoviePopUp(element)}); 

        // add all new html elements to movieCard
        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle); 
        movieCard.appendChild(movieVotes); 

        // Add new movie card to main grid
        moviesGrid.appendChild(movieCard); 
    });
};

const fetchMovieURL = async (movieObject) => {

    const movieID = movieObject.id; 
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${API_KEY}`); 
    const data = await res.json(); 

    const movieURL = data.results[0].key; 
    if (movieURL) {
        return movieURL; 
    }
    else {
        return null; 
    }

}

const makeMoviePopUp =  async (movieObject) => {
    console.log("here"); 
    const moviePopUpCard = document.createElement("div"); 
    const moviePopUpVideo = document.createElement("iframe"); 
    const moviePopUpTitle = document.createElement("h2"); 
    const moviePopUpVotes = document.createElement("h4"); 
    const moviePopUpDesc = document.createElement("h3"); 

    moviePopUpCard.classList.add("movie-popup-card"); 
    moviePopUpVideo.classList.add("movie-popup-video"); 
    moviePopUpTitle.classList.add("movie-popup-title"); 
    moviePopUpVotes.classList.add("movie-popup-votes"); 
    moviePopUpDesc.classList.add("movie-popup-desc"); 


    moviePopUpTitle.innerHTML = movieObject.original_title; 
    moviePopUpDesc.innerHTML = movieObject.overview; 
    moviePopUpVotes.innerHTML = movieObject.vote_average; 
{/* <iframe id="modal-video" SameSite="None" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
    const movieURL = await fetchMovieURL(movieObject); 
    console.log(movieURL); 
    if (movieURL) {
        moviePopUpVideo.src = `https://www.youtube.com/embed/${movieURL}`
        // moviePopUpVideo.allow = "accelerometer"; 
        moviePopUpVideo.setAttribute("id", "movie-video");
        moviePopUpVideo.setAttribute("allow", "accelerometer");
        moviePopUpVideo.setAttribute("frameborder", 0); 
        moviePopUpVideo.toggleAttribute("autoplay"); 
    }
    else {
        moviePopUpVideo.remove(); 
    }


    moviePopUpCard.appendChild(moviePopUpVideo); 
    moviePopUpCard.appendChild(moviePopUpTitle); 
    moviePopUpCard.appendChild(moviePopUpDesc); 
    moviePopUpCard.appendChild(moviePopUpVotes); 

    moviesGrid.append(moviePopUpCard); 

}

const addEventListeners = () => {

    closeSearchButton.addEventListener("click", clearMoviesGrid); 

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        fetchQueriedMovieData(event); 
    })

    moreMoviesButton.addEventListener("click", fetchData); 

};

window.onload = () => {
    fetchData();
    addEventListeners(); 
}; 