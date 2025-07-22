// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.jsx"; // ✅ correctly named import
import MovieDetails from "./components/MovieDetails.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import Layout from "./components/Layout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* ✅ updated here */}
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
