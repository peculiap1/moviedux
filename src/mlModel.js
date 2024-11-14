import * as tf from "@tensorflow/tfjs";

// Expanded Genre Mapping
const genreMapping = {
  drama: 0,
  fantasy: 1,
  horror: 2,
  action: 3,
  thriller: 4,
  comedy: 5,
  romance: 6,
  "sci-fi": 7,
  documentary: 8,
  adventure: 9,
  mystery: 10,
  animation: 11,
};

// Create the model (default export)
const createModel = () => {
  const model = tf.sequential();
  // Input shape is [genre, rating], with 2 inputs per movie
  model.add(
    tf.layers.dense({ units: 10, activation: "relu", inputShape: [2] })
  );
  model.add(tf.layers.dense({ units: 10, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });
  return model;
};

export default createModel;

// Convert movie data into tensors for training
export const convertDataToTensors = (movieData) => {
  const inputs = movieData.map((movie) => [
    genreMapping[movie.genre] || 0, // Fallback for unknown genre
    movie.rating || 5, // Fallback for missing rating
  ]);
  const outputs = movieData.map((movie) => [movie.movieId]);

  return {
    inputs: tf.tensor2d(inputs),
    outputs: tf.tensor2d(outputs),
  };
};

// Train the model with the movie data
export const trainModel = async (model, data) => {
  const { inputs, outputs } = convertDataToTensors(data);
  await model.fit(inputs, outputs, { epochs: 50, batchSize: 4 });
  console.log("Model trained!");
};

// Predict ratings for the movies in the watchlist
export const predictRatings = (model, watchlistMovies) => {
  const predictions = watchlistMovies.map((movie) => {
    try {
      const input = tf.tensor2d([[genreMapping[movie.genre], movie.rating]]);
      const prediction = model.predict(input);
      return prediction.dataSync()[0];
    } catch (err) {
      console.error(`Error in prediction for movie: ${movie.title}`, err);
      return 0; // Fallback to 0 in case of errors
    }
  });

  return predictions;
};

// Recommend movies based on the watchlist and all available movies
export const recommendMovies = (
  model,
  watchlistMovies,
  allMovies,
  genreFrequency
) => {
  const predictions = allMovies.map((movie) => {
    try {
      const similarityScore = watchlistMovies.reduce(
        (score, watchlistMovie) => {
          const genreSimilarity =
            genreMapping[movie.genre] === genreMapping[watchlistMovie.genre]
              ? 1
              : 0;
          const ratingSimilarity =
            Math.abs(movie.rating - watchlistMovie.rating) < 1 ? 1 : 0;
          return score + genreSimilarity + ratingSimilarity;
        },
        0
      );

      const genreBoost = genreFrequency[movie.genre] || 0;

      const input = tf.tensor2d([[genreMapping[movie.genre], movie.rating]]);
      let modelScore = 0;
      const prediction = model.predict(input);
      modelScore = prediction.dataSync()[0];

      if (isNaN(modelScore)) {
        console.error(`Invalid model score for movie: ${movie.title}`);
        modelScore = 0;
      }

      return {
        movieId: movie.movieId,
        score: modelScore + similarityScore + genreBoost,
      };
    } catch (err) {
      console.error(`Error processing movie: ${movie.title}`, err);
      return { movieId: movie.movieId, score: 0 };
    }
  });

  return predictions
    .map((rec) => ({
      ...rec,
      score: rec.score + Math.random() * 0.1,
    }))
    .sort((a, b) => b.score - a.score);
};
