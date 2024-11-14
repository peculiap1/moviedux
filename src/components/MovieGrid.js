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
  const [genreFrequency, setGenreFrequency] = useState({});

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleGenreChange = (e) => setGenre(e.target.value);
  const handleRatingChange = (e) => setRating(e.target.value);

  // Update genre frequency whenever watchlist changes
  useEffect(() => {
    const frequency = {};
    watchlist.forEach((id) => {
      const movie = movies.find((movie) => movie.movieId === id);
      if (movie) {
        const genre = movie.genre;
        frequency[genre] = (frequency[genre] || 0) + 1;
      }
    });
    setGenreFrequency(frequency);
  }, [watchlist, movies]);

  useEffect(() => {
    let filtered = movies.filter(
      (movie) =>
        (genre === "All Genres" || movie.genre === genre) &&
        (rating === "All" ||
          (rating === "Good" && movie.rating >= 8) ||
          (rating === "Ok" && movie.rating >= 5 && movie.rating < 8) ||
          (rating === "Bad" && movie.rating < 5)) &&
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (model && watchlist.length > 0) {
      const watchlistMovies = watchlist.map((id) =>
        movies.find((movie) => movie.movieId === id)
      );

      const recommendedMoviesList = recommendMovies(
        model,
        watchlistMovies,
        filtered,
        genreFrequency // Pass the genre frequency
      );

      const recommendedIds = recommendedMoviesList.map((rec) => rec.movieId);

      filtered = filtered.sort((a, b) => {
        return (
          recommendedIds.indexOf(a.movieId) - recommendedIds.indexOf(b.movieId)
        );
      });
    }

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
            key={movie.movieId || movie.id}
            toggleWatchlist={toggleWatchlist}
            isWatchlisted={watchlist.includes(movie.movieId)}
          />
        ))}
      </div>
    </div>
  );
}
