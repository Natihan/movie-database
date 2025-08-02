import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import WatchListPage from "./pages/WatchListPage.jsx";
import Layout from "./components/Layout.jsx";

import PopularMovies from "./pages/PopularMovies.jsx";
import NowPlayingMovies from "./pages/NowPlayingMovies.jsx";
import UpcomingMovies from "./pages/UpcomingMovies.jsx";
import TopRatedMovies from "./pages/TopRatedMovies.jsx";

import PopularTVShows from "./pages/PopularTVShows.jsx";
import OnTV from "./pages/OnTV.jsx";
import AiringToday from "./pages/AiringToday.jsx";
import TopRatedTVShows from "./pages/TopRatedTVShows.jsx";

import PopularPeople from "./pages/PopularPeople.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

import ProfileLayout from "./pages/ProfileLayout.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ReviewsPage from "./pages/ReviewsPage.jsx";
import LikesPage from "./pages/LikesPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id" element={<MovieDetails />} />

            {/* Movies */}
            <Route path="movies/popular" element={<PopularMovies />} />
            <Route path="movies/now-playing" element={<NowPlayingMovies />} />
            <Route path="movies/upcoming" element={<UpcomingMovies />} />
            <Route path="movies/top-rated" element={<TopRatedMovies />} />

            {/* TV Shows */}
            <Route path="tv/popular" element={<PopularTVShows />} />
            <Route path="tv/on-tv" element={<OnTV />} />
            <Route path="tv/airing-today" element={<AiringToday />} />
            <Route path="tv/top-rated" element={<TopRatedTVShows />} />

            {/* People */}
            <Route path="person/popular" element={<PopularPeople />} />

            {/* Auth */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            {/* Profile and sub-pages */}
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<ProfilePage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="watchlist" element={<WatchListPage />} />
              <Route path="likes" element={<LikesPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Add root-level routes for direct access */}
            <Route path="watchlist" element={<WatchListPage />} />
            <Route path="likes" element={<LikesPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
