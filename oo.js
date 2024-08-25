const apiKey = '9a7a0e8dd1aa7e25c82440c0821ebe51';
const apiBaseUrl = 'https://api.themoviedb.org/3';

let currentPage = 1;
const resultsPerPage = 10; // Adjust based on your needs

// Utility function to build image URL
function buildImageUrl(path) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'placeholder-image-url';
}

// Function to fetch trailers
function fetchTrailer(movieId) {
    return fetch(`${apiBaseUrl}/movie/${movieId}/videos?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const trailer = data.results.find(video => video.type === 'Trailer');
            return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
            return null;
        });
}

// Function to display results
async function displayResults(results) {
    const container = document.getElementById('trending-movies');
    container.innerHTML = ''; // Clear previous results

    for (const result of results) {
        const posterFrame = document.createElement('div');
        posterFrame.className = 'poster-frame';

        const posterImage = document.createElement('img');
        posterImage.className = 'poster-image';
        posterImage.src = buildImageUrl(result.poster_path || result.profile_path);
        posterImage.alt = result.title || result.name;

        const movieName = document.createElement('div');
        movieName.className = 'movie-name';
        movieName.textContent = result.title || result.name;

        const movieRating = document.createElement('div');
        movieRating.className = 'movie-rating';
        movieRating.textContent = `Rating: ${result.vote_average || 'N/A'}`;

        const trailerButton = document.createElement('button');
        trailerButton.className = 'trailer-button';
        trailerButton.textContent = 'Watch Trailer';
        trailerButton.onclick = async () => {
            const trailerUrl = await fetchTrailer(result.id);
            if (trailerUrl) {
                window.open(trailerUrl, '_blank');
            } else {
                alert('Trailer not available.');
            }
        };

        posterFrame.appendChild(posterImage);
        posterFrame.appendChild(movieName);
        posterFrame.appendChild(movieRating);
        posterFrame.appendChild(trailerButton);

        container.appendChild(posterFrame);
    }
}

// Function to fetch trending movies
function fetchTrending(period) {
    fetch(`${apiBaseUrl}/trending/all/${period}?api_key=${apiKey}&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.results);
            if (data.results.length > 0) {
                document.getElementById('load-more-btn').style.display = 'block'; // Show load more button
            } else {
                document.getElementById('load-more-btn').style.display = 'none'; // Hide button if no more data
            }
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

// Function to load more movies
function loadMoreMovies() {
    currentPage++;
    const period = getCurrentPeriod(); // Function to get the current period (day/week)
    fetchTrending(period);
}

// Function to get the current period (e.g., from the period toggle buttons)
function getCurrentPeriod() {
    const activeButton = document.querySelector('.period-toggle button.active');
    return activeButton ? activeButton.dataset.period : 'day'; // Default to 'day' if no active button
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and populate genres
    fetch(`${apiBaseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`)
        .then(response => response.json())
        .then(data => populateGenres(data.genres))
        .catch(error => console.error('Error fetching genres:', error));

    // Fetch and populate years
    populateYears();

    // Initialize default fetch
    fetchTrending('day'); // Default period
});

// Function to fetch movies
function fetchMovies() {
    fetch(`${apiBaseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching movies:', error));
}

// Function to fetch TV shows
function fetchTVShows() {
    fetch(`${apiBaseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc`)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching TV shows:', error));
}

// Function to fetch popular people
function fetchPeople() {
    fetch(`${apiBaseUrl}/person/popular?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching people:', error));
}

// Function to fetch movies by genre
function fetchMoviesByGenre(genreId) {
    fetch(`${apiBaseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching movies by genre:', error));
}

// Function to search
function search() {
    const query = document.getElementById('search-input').value;
    if (query) {
        fetch(`${apiBaseUrl}/search/multi?api_key=${apiKey}&query=${query}`)
            .then(response => response.json())
            .then(data => displayResults(data.results))
            .catch(error => console.error('Error searching:', error));
    }
}

// Function to apply filters
function applyFilters() {
    const genre = document.getElementById('genre-select').value;
    const year = document.getElementById('year-select').value;
    const rating = document.getElementById('rating-select').value;

    let url = `${apiBaseUrl}/discover/movie?api_key=${apiKey}&language=en-US`;

    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&year=${year}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error applying filters:', error));
}

// Function to populate genres
function populateGenres(genres) {
    const genreSelect = document.getElementById('genre-select');
    genreSelect.innerHTML = '<option value="">All</option>'; // Default option

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

// Function to populate years
function populateYears() {
    const yearSelect = document.getElementById('year-select');
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Event listener for "Load More" button
document.getElementById('load-more-btn').addEventListener('click', loadMoreMovies);
// Function to fetch trailers
function fetchTrailer(movieId) {
    return fetch(`${apiBaseUrl}/movie/${movieId}/videos?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const trailer = data.results.find(video => video.type === 'Trailer');
            return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
            return null;
        });
}

// Function to display results
async function displayResults(results) {
    const container = document.getElementById('trending-movies');
    container.innerHTML = ''; // Clear previous results

    for (const result of results) {
        const posterFrame = document.createElement('div');
        posterFrame.className = 'poster-frame';

        const posterImage = document.createElement('img');
        posterImage.className = 'poster-image';
        posterImage.src = buildImageUrl(result.poster_path || result.profile_path);
        posterImage.alt = result.title || result.name;

        const movieName = document.createElement('div');
        movieName.className = 'movie-name';
        movieName.textContent = result.title || result.name;

        const movieRating = document.createElement('div');
        movieRating.className = 'movie-rating';
        movieRating.textContent = `Rating: ${result.vote_average || 'N/A'}`;

        const trailerButton = document.createElement('button');
        trailerButton.className = 'trailer-button';
        trailerButton.innerHTML = '<i class="fas fa-play"></i> Watch Trailer';
        trailerButton.onclick = async () => {
            const trailerUrl = await fetchTrailer(result.id);
            if (trailerUrl) {
                window.open(trailerUrl, '_blank');
            } else {
                alert('Trailer not available.');
            }
        };

        posterFrame.appendChild(posterImage);
        posterFrame.appendChild(movieName);
        posterFrame.appendChild(movieRating);
        posterFrame.appendChild(trailerButton);

        container.appendChild(posterFrame);
    }
}
// Function to apply filters
function applyFilters() {
    const genre = document.getElementById('genre-select').value;
    const year = document.getElementById('year-select').value;
    const rating = document.getElementById('rating-select').value;

    let url = `${apiBaseUrl}/discover/movie?api_key=${apiKey}&language=en-US`;

    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&year=${year}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error applying filters:', error));
}

// Event listener for "Apply Filters" button
document.getElementById('apply-filters-btn').addEventListener('click', applyFilters);
// Function to apply filters
function applyFilters() {
    const genre = document.getElementById('genre-select').value;
    const year = document.getElementById('year-select').value;
    const rating = document.getElementById('rating-select').value;

    let url = `${apiBaseUrl}/discover/movie?api_key=${apiKey}&language=en-US`;

    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&year=${year}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error applying filters:', error));
}

// Event listener for "Apply Filters" button
document.getElementById('apply-filters-btn').addEventListener('click', applyFilters);
// Define a delay in milliseconds
const delay = 2000; // 2 seconds delay

// Function to load more items
function loadMoreItems() {
    // Disable the button to prevent multiple clicks
    const loadMoreButton = document.getElementById('load-more-btn');
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = 'Loading...';

    // Introduce a delay before making the request
    setTimeout(() => {
        // Fetch more data from API
        fetchMoreData()
            .then(data => {
                displayMoreItems(data.results);
                // Re-enable the button after data is loaded
                loadMoreButton.disabled = false;
                loadMoreButton.textContent = 'Load More';
            })
            .catch(error => {
                console.error('Error loading more items:', error);
                loadMoreButton.disabled = false;
                loadMoreButton.textContent = 'Load More';
            });
    }, delay);
}

// Add event listener to the "Load More" button
document.getElementById('load-more-btn').addEventListener('click', loadMoreItems);

// Example fetchMoreData function (to be implemented)
function fetchMoreData() {
    // Replace with your API call
    return fetch(`${apiBaseUrl}/movie/popular?api_key=${apiKey}&page=${nextPage}`)
        .then(response => response.json());
}

// Example displayMoreItems function (to be implemented)
function displayMoreItems(items) {
    // Code to display items on the page
    // For example: append new items to the existing list
}
