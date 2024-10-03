import React, { useState, useEffect } from "react";
import "../styles.css";
import MovieCard from "./MovieCard";
import { recommendMovies } from "../mlModel";

export default function MoviesGrid({
  movies,
  watchlist,
  toggleWatchlist,
  model,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("All Genres");
  const [rating, setRating] = useState("All");
  const [filteredMovies, setFilteredMovies] = useState(movies);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };
  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const matchesGenre = (movie, genre) => {
    return (
      genre === "All Genres" ||
      movie.genre.toLowerCase() === genre.toLowerCase()
    );
  };

  const matchesSearchTerm = (movie, searchTerm) => {
    return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const matchesRating = (movie, rating) => {
    switch (rating) {
      case "All":
        return true;
      case "Good":
        return movie.rating >= 8;
      case "Ok":
        return movie.rating >= 5 && movie.rating < 8;
      case "Bad":
        return movie.rating < 5;
      default:
        return false;
    }
  };

  useEffect(() => {
    // Filter based on search, genre, and rating
    let filtered = movies.filter(
      (movie) =>
        matchesGenre(movie, genre) &&
        matchesRating(movie, rating) &&
        matchesSearchTerm(movie, searchTerm)
    );

    // If model and watchlist exist, apply recommendations to sorted order
    if (model && watchlist.length > 0) {
      const watchlistMovies = watchlist.map((id) =>
        movies.find((movie) => movie.movieId === id)
      );

      const recommendedMoviesList = recommendMovies(
        model,
        watchlistMovies,
        filtered
      );
      const recommendedIds = recommendedMoviesList.map((rec) => rec.movieId);

      // Sort the filtered movies based on recommendedIds
      filtered = filtered.sort((a, b) => {
        return (
          recommendedIds.indexOf(a.movieId) - recommendedIds.indexOf(b.movieId)
        );
      });
    }

    // Update the filteredMovies state
    setFilteredMovies(filtered);
  }, [movies, watchlist, searchTerm, genre, rating, model]);

  return (
    <div>
      <input
        type="text"
        className="search-input"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="filter-bar">
        <div className="filter-slot">
          <label>Genre</label>
          <select
            className="filter-dropdown"
            value={genre}
            onChange={handleGenreChange}
          >
            <option value="All Genres">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
          </select>
        </div>
        <div className="filter-slot">
          <label>Rating</label>
          <select
            className="filter-dropdown"
            value={rating}
            onChange={handleRatingChange}
          >
            <option value="All">All</option>
            <option value="Good">Good</option>
            <option value="Ok">Ok</option>
            <option value="Bad">Bad</option>
          </select>
        </div>
      </div>

      <div className="movies-grid">
        {filteredMovies.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.movieId}
            toggleWatchlist={toggleWatchlist}
            isWatchlisted={watchlist.includes(movie.movieId)}
          />
        ))}
      </div>
    </div>
  );
}
