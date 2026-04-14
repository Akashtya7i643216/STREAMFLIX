import axios from 'axios'

const BASE = 'https://imdb.iamidiotareyoutoo.com'

const client = axios.create({ baseURL: BASE, timeout: 10000 })

// Search by query (name, year, id)
export const searchTitles = (query, page = 1) =>
  client.get('/search', { params: { q: query, page } }).then((r) => r.data)

// Get details by IMDb ID
export const getTitleById = (id) =>
  client.get('/search', { params: { q: id } }).then((r) => r.data)

// Trending / top-rated (used for home page rows)
export const getTrending = (page = 1) =>
  client.get('/search', { params: { q: 'popular 2024', page } }).then((r) => r.data)

export const getByCategory = (category, page = 1) => {
  const queryMap = {
    movies: 'best movies',
    tvshows: 'best tv series',
    videogames: 'video game',
  }
  return client
    .get('/search', { params: { q: queryMap[category] || 'popular', page } })
    .then((r) => r.data)
}

// Normalize raw API item → consistent shape
export const normalizeItem = (raw) => ({
  id: raw['#IMDB_ID'] || raw.id || String(Math.random()),
  title: raw['#TITLE'] || raw.title || 'Unknown',
  year: raw['#YEAR'] || raw.year || '',
  rank: raw['#RANK'] || '',
  actors: raw['#ACTORS'] || '',
  aka: raw['#AKA'] || '',
  imdbUrl: raw['#IMDB_URL'] || '',
  poster: raw['#IMG_POSTER'] || raw['#POSTER'] || null,
  type: raw['#TYPE'] || 'movie',
  rating: raw['#RATING'] || '',
  description: raw['#DESCRIPTION'] || raw.description || '',
})
