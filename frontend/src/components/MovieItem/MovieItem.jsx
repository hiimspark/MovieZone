import React from "react";
import { useNavigate } from "react-router-dom";
import { addToWatchlog } from "../../utils/api";
import "./MovieItem.css";

const MovieItem = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/library/${movie.id}/`);
  };

  const handleAddToWatchlist = (e, movieId) =>{
    e.preventDefault();
    e.stopPropagation();
    try{
        addToWatchlog(movieId);
    }
    catch{

    }
  }

  return (
    <div className="movieitem-block" onClick={handleClick}>
      <img src={movie.poster} alt={movie.title} className="movieitem-poster" />
      <div className="movieitem-info">
        <h3>{movie.title}</h3>
        <p>{movie.short_description}</p>
        <div className="movieitem-footer">
            <span className="movieitem-rating">★ {movie.critic_rating}</span>
            <button className="watchlist-button" onClick={(e) => handleAddToWatchlist(e, movie.id)}>Добавить в дневник</button>
        </div>
      </div>
    </div>
  );
};

export default MovieItem;
