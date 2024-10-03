import "./App.css";
import "./styles.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MoviesGrid from "./components/MovieGrid";
import Watchlist from "./components/Watchlist";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import createModel, { trainModel, predictRatings } from "./mlModel"; // Import the necessary ML functions
import movieData from "./movieData";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Create and train the model when the app loads
    const newModel = createModel();
    trainModel(newModel, movieData).then(() => {
      setModel(newModel);
    });
  }, []);

  useEffect(() => {
    fetch("movies.json")
      .then((response) => response.json())
      .then((data) => setMovies(data));
  }, []);

  const toggleWatchlist = (movieId) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.includes(movieId)
        ? prevWatchlist.filter((id) => id !== movieId)
        : [...prevWatchlist, movieId]
    );
  };

  const recommendedMovies = model
    ? predictRatings(
        model,
        watchlist
          .map((id) => movies.find((movie) => movie.movieId === id))
          .filter((movie) => movie !== undefined) // Filter to remove undefined movies
          .map((movie) => movie.genre)
      )
    : [];

  return (
    <div className="App">
      <div className="container">
        <Header />
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/watchlist">Watchlist</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route
              path="/"
              element={
                <MoviesGrid
                  movies={movies}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                  model={model}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <Watchlist
                  movies={movies}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                  recommendedMovies={recommendedMovies}
                />
              }
            />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
