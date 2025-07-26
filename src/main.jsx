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

// New pages for TV Shows and People (reuse PopularMovies)
import PopularTVShows from "./pages/PopularTVShows.jsx";
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

          {/* TV Shows and People */}
          <Route path="tv/popular" element={<PopularTVShows />} />
          <Route path="person/popular" element={<PopularPeople />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
