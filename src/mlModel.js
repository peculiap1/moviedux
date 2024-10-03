import * as tf from "@tensorflow/tfjs";

const genreMapping = {
  drama: 0,
  fantasy: 1,
  horror: 2,
  action: 3,
};

// Create Model (default export)
const createModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 10, activation: "relu", inputShape: [1] })
  );
  model.add(tf.layers.dense({ units: 10, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });
  return model;
};

export default createModel; // Ensure it's default export

// Named exports
export const convertDataToTensors = (movieData) => {
  const inputs = movieData.map((movie) => [genreMapping[movie.genre]]);
  const outputs = movieData.map((movie) => [movie.movieId]);

  return {
    inputs: tf.tensor2d(inputs),
    outputs: tf.tensor2d(outputs),
  };
};

export const trainModel = async (model, data) => {
  const { inputs, outputs } = convertDataToTensors(data);
  await model.fit(inputs, outputs, { epochs: 50, batchSize: 4 });
  console.log("Model is getraind!");
};

export const predictRatings = (model, movieGenres) => {
  const genreTensors = movieGenres.map((genre) =>
    tf.tensor2d([[genreMapping[genre]]])
  );
  const predictions = genreTensors.map((tensor) => {
    const prediction = model.predict(tensor);
    return prediction.dataSync()[0];
  });
  return predictions;
};

export const recommendMovies = (model, watchlistMovies, allMovies) => {
  // Create a map to keep track of how many times each genre is in the watchlist
  const genreFrequency = watchlistMovies.reduce((acc, movie) => {
    const genre = movie.genre;
    if (acc[genre]) {
      acc[genre]++;
    } else {
      acc[genre] = 1;
    }
    return acc;
  }, {});

  // Predict the relevance of each movie in allMovies based on similarity to the watchlist
  const predictions = allMovies.map((movie) => {
    const genreScore = genreFrequency[movie.genre] || 0; // Score based on how frequent this genre is in the watchlist
    const input = tf.tensor2d([[genreMapping[movie.genre]]]);
    const modelPrediction = model.predict(input).dataSync()[0];

    // Combine the frequency of the genre and the model's prediction for a final score
    const score = genreScore + modelPrediction;

    return { movieId: movie.movieId, score };
  });

  // Sort movies by the score calculated
  return predictions.sort((a, b) => b.score - a.score);
};
