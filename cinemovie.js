const buttonElement = document.querySelector('.js-search-btn')
const inputElement = document.querySelector('.js-search-input')
const errorElement = document.querySelector('.js-error')
const result = document.querySelector('.js-results-count')
const movieGrid = document.querySelector('.js-movies-grid')


buttonElement.addEventListener('click', () => {
  const searchInput = inputElement.value.trim()
  fetchMovies(searchInput)
})




const apikey = '0364623d9efdd87aaa14ca87b413be41'

async function fetchMovies(query) {
  try {
    if (!query) {
      errorElement.textContent = `please enter a movie name`
      errorElement.classList.remove('hidden')
      return
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('could fetch movie')
    }
    const data = await response.json()
    let foundMovie = 0
    data.results.forEach((found) => {
      if (found.backdrop_path) {
        foundMovie++
      }
    })

    result.textContent = `Found ${foundMovie} results for ${query}`
    result.classList.remove('hidden')

    let img = ''
    data.results.forEach((file) => {

      if (file.backdrop_path === null) {
        return
      }
      let posterUrl = file.backdrop_path ? `<img src="https://image.tmdb.org/t/p/w500${file.backdrop_path}" alt="image" class="movie-poster">` : `<div class="movie-poster-placeholder">No image</div>`
      img += `
<div class="js-movie-card movie-card" data-movie-id="${file.id}">
  ${posterUrl}
  <div class="movie-info">
    <div class="movie-title">${file.title}</div>
    <div class="movie-meta">
    <span class="movie-year">${file.release_date
        }</span>
<span class="movie-rating">rating ${file.vote_average
        }</span>
</div>
  </div>
</div>
    `
    })
    movieGrid.innerHTML = img
    errorElement.classList.add('hidden')

    movieGrid.addEventListener('click', (e) => {
      const movieCard = e.target.closest('.js-movie-card')
      const id = movieCard.dataset.movieId
      playTrailer(id)
    })

  }
  catch (error) {
    if (error instanceof TypeError) {
      errorElement.textContent = `No internet connection`
    } else {
      errorElement.textContent = error.message
    }
    errorElement.classList.remove('hidden')
movieGrid.innerHTML=''
result.textContent=''
  }

}

async function playTrailer(id) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apikey}`)
    if (!response.ok) {
      throw new Error(`Status code: ${response.status}`)
    }
    const data = await response.json()
    const trailer = data.results.find((video) => {
      return video.type === 'Trailer' && video.site === 'YouTube'
    })
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`)
      errorElement.classList.add('hidden')
    } else {
      errorElement.textContent = `can't play video`
      errorElement.classList.remove('hidden')
    }


  }
  catch (error) {
    if (error instanceof TypeError) {
      errorElement.textContent = `No internet connection`
    } else {
      errorElement.textContent = error.message
    }
    errorElement.classList.remove('hidden')
  }
}



/*
function click() {
  const movieCard = document.querySelectorAll('.js-movie-card')
  movieCard.forEach((card) => {
    card.addEventListener('click', (e) => {
      const id = card.dataset.movieId
      console.log(id)
    })
  })
}
*/