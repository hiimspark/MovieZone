import React, { useEffect, useState } from "react";
import { getMovies } from "../../utils/api";
import MovieItem from "../../components/MovieItem/MovieItem";
import "./Library.css";



const Library = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getMovies()
            .then((res) => res.json())
            .then((data) => {setMovies(data); setLoading(false);})
            .catch((err) => console.error("Failed to fetch movies:", err));
    },  []);

    
  return (
    <div className="library">
      <div className="library-content">
        <h1>Библиотека</h1>
        {loading ? (
        <div className="movie-block">
            {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="movie-skeleton"></div>
            ))}
        </div>
        ) : (
        <div className="movie-block">
            {movies.map(movie => (
            <MovieItem key={movie.id} movie={movie} />
            ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Library;
