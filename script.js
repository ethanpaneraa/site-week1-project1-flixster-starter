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

const refreshPage = () => {
    location.reload(); 
}

const fetchQueriedMovieData = async (query) => {
    moviesGrid.innerHTML = ""; 
    const queryText = query.target.query.value; 
    // Make sure that query is valid
    if (query) {
        const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${pagesNum}&query=${queryText}`;
        const res = await fetch(URL); 
        const data = await res.json(); 
        pagesNum += 1; 

        if (data.results.length != 0) {
            makeMovieCards(data.results);
        }
        else {
            alert("No movies found :("); 
            pagesNum = 0; 
            searchForm.reset(); 
            fetchData(); 
        }
    }

    else {
        alert(`No movies found with ${queryText}`)
        fetchData(); 

    }

    makeCloseSearchButton(); 
};

const clearMoviesGrid = async () => {
    moviesGrid.innerHTML = ""
    pagesNum = 1; 

    const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pagesNum}`;
    const res = await fetch(URL); 
    const data = await res.json(); 

    destoryCloseSearchButton(); 
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

const makeCloseSearchButton = () => {
    
    const headerContainer = document.querySelector(".header-container"); 
    const closeSearchButton = document.createElement("button"); 
    closeSearchButton.setAttribute("id", "close-search-btn"); 
    closeSearchButton.innerHTML = "Reset Search"; 
    closeSearchButton.addEventListener("click", clearMoviesGrid); 
    headerContainer.appendChild(closeSearchButton); 

}

const destoryCloseSearchButton = () => {

    const closeSearchButton = document.querySelector("#close-search-btn"); 
    closeSearchButton.remove(); 

}

const destoryMoviePopUp = () => {

    const moviePopUp = document.querySelector(".movie-popup-card"); 
    const moviePopUpCardBackground = document.querySelector(".movie-popup-card-background");
    moviePopUp.remove(); 
    moviePopUpCardBackground.remove(); 

}

const makeMoviePopUp =  async (movieObject) => {
    console.log("here"); 
    const moviePopUpCard = document.createElement("div"); 
    const moviePopUpCardBackground = document.createElement("div"); 
    const moviePopUpVideo = document.createElement("iframe"); 
    const moviePopUpTitle = document.createElement("h2"); 
    const moviePopUpVotes = document.createElement("h4"); 
    const moviePopUpDesc = document.createElement("h3"); 
    const moviePopUpCloseButton = document.createElement("button"); 

    moviePopUpCard.setAttribute("class", "movie-popup-card");
    moviePopUpCardBackground.classList.add("movie-popup-card-background") 
    moviePopUpVideo.classList.add("movie-popup-video"); 
    moviePopUpTitle.classList.add("movie-popup-title"); 
    moviePopUpVotes.classList.add("movie-popup-votes"); 
    moviePopUpDesc.classList.add("movie-popup-desc"); 
    moviePopUpCloseButton.classList.add("movie-popup-close-button"); 


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

    moviePopUpCardBackground.addEventListener("click", destoryMoviePopUp); 
    moviePopUpCloseButton.addEventListener("click", destoryMoviePopUp); 
    moviePopUpCard.appendChild(moviePopUpTitle);
    moviePopUpCard.appendChild(moviePopUpVideo);  
    moviePopUpCard.appendChild(moviePopUpDesc); 
    moviePopUpCard.appendChild(moviePopUpVotes); 
    moviePopUpCard.appendChild(moviePopUpCloseButton); 


    moviesGrid.append(moviePopUpCardBackground); 
    moviesGrid.append(moviePopUpCard); 

}

const addEventListeners = () => {

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        fetchQueriedMovieData(event); 
    });

    moreMoviesButton.addEventListener("click", fetchData); 

    const websiteHeaderTitle = document.querySelector("h1"); 
    console.log(websiteHeaderTitle); 
    websiteHeaderTitle.addEventListener("click", refreshPage); 
};

window.onload = () => {
    fetchData();
    addEventListeners(); 
}; 