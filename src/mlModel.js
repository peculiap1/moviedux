import * as tf from "@tensorflow/tfjs";

// Genre Mapping
const genreMapping = {
  drama: 0,
  fantasy: 1,
  horror: 2,
  action: 3,
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
    genreMapping[movie.genre],
    movie.rating,
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
    const input = tf.tensor2d([[genreMapping[movie.genre], movie.rating]]);
    const prediction = model.predict(input);
    return prediction.dataSync()[0];
  });

  return predictions;
};

// Recommend movies based on the watchlist and all available movies
export const recommendMovies = (model, watchlistMovies, allMovies) => {
  // Calculate similarity scores based on both genre and rating
  const predictions = allMovies.map((movie) => {
    // Check similarity between current movie and each watchlist movie
    let similarityScore = watchlistMovies.reduce((score, watchlistMovie) => {
      const genreSimilarity =
        genreMapping[movie.genre] === genreMapping[watchlistMovie.genre]
          ? 1
          : 0;
      const ratingSimilarity =
        Math.abs(movie.rating - watchlistMovie.rating) < 1 ? 1 : 0;

      return score + genreSimilarity + ratingSimilarity;
    }, 0);

    // Generate prediction score from the model
    const input = tf.tensor2d([[genreMapping[movie.genre], movie.rating]]);
    let modelScore = 0;
    try {
      const prediction = model.predict(input);
      modelScore = prediction.dataSync()[0];

      if (isNaN(modelScore)) {
        console.error(`Invalid model score for movie: ${movie.title}`);
        modelScore = 0; // Fallback to 0 if invalid
      }
    } catch (err) {
      console.error(`Error in prediction for movie: ${movie.title}`, err);
      modelScore = 0; // Fallback to 0 if an error occurs
    }

    return {
      movieId: movie.movieId,
      score: modelScore + similarityScore,
    };
  });

  // Sort movies by the combined score and add randomness to avoid strict ranking
  return predictions
    .map((rec) => ({
      ...rec,
      score: rec.score + Math.random() * 0.1, // Add slight randomness
    }))
    .sort((a, b) => b.score - a.score); // Sort by the new score
};
