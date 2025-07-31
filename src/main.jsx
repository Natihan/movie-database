import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import Layout from "./components/Layout.jsx";

import PopularMovies from "./pages/PopularMovies.jsx";
import NowPlayingMovies from "./pages/NowPlayingMovies.jsx";
import UpcomingMovies from "./pages/UpcomingMovies.jsx";
import TopRatedMovies from "./pages/TopRatedMovies.jsx";

import PopularTVShows from "./pages/PopularTVShows.jsx";
import OnTV from "./pages/OnTV.jsx";
import AiringToday from "./pages/AiringToday.jsx";
import TopRatedTVShows from "./pages/TopRatedTVShows.jsx"; // ✅ Added import for Top Rated TV Shows

import PopularPeople from "./pages/PopularPeople.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="favorites" element={<FavoritesPage />} />

          {/* Movies */}
          <Route path="movies/popular" element={<PopularMovies />} />
          <Route path="movies/now-playing" element={<NowPlayingMovies />} />
          <Route path="movies/upcoming" element={<UpcomingMovies />} />
          <Route path="movies/top-rated" element={<TopRatedMovies />} />

          {/* TV Shows */}
          <Route path="tv/popular" element={<PopularTVShows />} />
          <Route path="tv/on-tv" element={<OnTV />} /> {/* ✅ Path updated */}
          <Route path="tv/airing-today" element={<AiringToday />} />
          <Route path="tv/top-rated" element={<TopRatedTVShows />} /> {/* ✅ New Top Rated TV route */}

          {/* People */}
          <Route path="person/popular" element={<PopularPeople />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
