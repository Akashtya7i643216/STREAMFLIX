1# StreamFlix

Netflix-style short-form media platform UI built with React + Vite.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview  # preview production build
```

## Features

- Sign-in screen (email/password UI + guest mode)
- Hero banner with "Today's Top Show"
- Horizontal content rows per genre with skeleton loaders
- Infinite scroll grid per category (Movies / TV Shows / Video Games)
- Real-time search with debounced suggestions dropdown
- Movie preview modal (watchlist + watch history)
- Profile page with watchlist and watch history tabs
- Dark/light theme toggle
- PWA service worker (offline support + cache)
- Online/offline status banner
- Keyboard navigation + accessible markup

## API

Uses [FM-DB API](https://imdb.iamidiotareyoutoo.com) — free, no key required.

## Stage 2 (Firebase Auth)

Install Firebase and replace the `login()` mock in `SignIn.jsx` with:

```bash
npm install firebase
```

```js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
// initialize app with your firebaseConfig, then:
const auth = getAuth()
signInWithEmailAndPassword(auth, email, password)
  .then(cred => login({ name: cred.user.displayName, email: cred.user.email }))
```

## Structure

```
src/
  components/   # Navbar, SearchBar, MovieCard, ContentRow, HeroBanner, MovieModal, ...
  context/      # AppContext (auth, theme, watchlist, history)
  hooks/        # useDebounce, useInfiniteScroll, useFetch
  pages/        # SignIn, Home, Browse, Profile
  services/     # api.js (axios + normalizer)
  styles/       # global.css
  utils/        # helpers.js
```
