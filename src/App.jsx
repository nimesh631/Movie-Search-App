import { useState } from "react";
import MovieCard from "./components/MovieCard";
import axios from "axios";

function App() {
  const [query, setQuery] = useState(""); // search query
  const [movies, setMovies] = useState([]); // movies list
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error message

  // NEW: states for pagination
  const [page, setPage] = useState(1); // current page number
  const [totalResults, setTotalResults] = useState(0); // total results returned by API

  const searchMovies = async (newPage = 1) => {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const url = `http://www.omdbapi.com/?s=${query}&page=${newPage}&apikey=${apiKey}`;
      const response = await axios.get(url);

      if (response.data.Search) {
        // Remove duplicates by imdbID
        const uniqueMovies = Array.from(
          new Map(response.data.Search.map((movie) => [movie.imdbID, movie])).values()
        );

        setMovies(uniqueMovies);
        setPage(newPage); // update page state
        setTotalResults(Number(response.data.totalResults)); // save total results
      } else {
        setMovies([]);
        setError("No movies found. Try another title!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / 10); // OMDB API returns 10 results per page

  return (
    <div className="min-h-screen p-6 bg-gray-400 text-center">
      <h1 className="text-3xl font-bold mb-4">Movie Search App</h1>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search Movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies(1)} // reset to page 1
          className="border p-2 bg-white mb-4 rounded"
        />
        <button
          onClick={() => searchMovies(1)} // reset to page 1
          className="bg-blue-600 p-2 ml-2 text-white rounded hover:bg-blue-800 hover:text-lg"
        >
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-center text-red-800 text-xl mt-4">{error}</p>}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.imdbID}-${index}`} movie={movie} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => searchMovies(page - 1)}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => searchMovies(page + 1)}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
