import { useState } from "react";
import MovieCard from "./components/MovieCard";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async () => {
    if (!query) return;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
      const response = await axios.get(url);
      if (response.data.Search) {
        // Remove duplicates by imdbID
        const uniqueMovies = Array.from(
          new Map(
            response.data.Search.map((movie) => [movie.imdbID, movie])
          ).values()
        );
        setMovies(uniqueMovies);
      } else {
        setMovies([]);
        setError("No movies found. Try another title!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-400 text-center">
      <h1 className="text-3xl font-bold mb-4">Movie Search App</h1>
      <div>
        <input
          type="text"
          placeholder="Search Movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies()}
          className="border p-2 bg-white mb-4 rounded"
        />
        <button
          onClick={searchMovies}
          className="bg-blue-600 p-2 ml-2 text-white rounded hover:bg-blue-800 hover:text-lg"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && <p className="text-center text-red-800 text-xl mt-4">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 space-x-4">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.imdbID} - ${index}`} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;
