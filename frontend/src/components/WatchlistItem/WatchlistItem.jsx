import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa6";
import "./WatchlistItem.css";

const WatchlistItem = ({ watchlistMovie, handleStatusChange, handleEpisodesChange, handleReview }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/library/${watchlistMovie.movie_or_series}/`);
  };

  return (
    <div className="watchlist-item">
      <img src={watchlistMovie.movie_or_series_poster} alt={watchlistMovie.movie_or_series_title} className="watchlist-poster" />
      <div className="watchlist-info">
        <h3 onClick={handleClick} >{watchlistMovie.movie_or_series_title}</h3>
        <p>Статус просмотра:</p>
        <select
          className="watchlist-select"
          id={`status-${watchlistMovie.id}`}
          value={watchlistMovie.status}
          onChange={(e) => handleStatusChange(e, watchlistMovie.id)}
        >
          <option value="watching">Смотрю</option>
          <option value="planned">Запланировано</option>
          <option value="completed">Просмотрено</option>
          <option value="dropped">Брошено</option>
          <option value="on_hold">Отложено</option>
        </select>
        <p>Количество просмотренных серий: {watchlistMovie.watched_episodes}/{watchlistMovie.total_episodes}</p>
        <div className="buttons-block">
            <FaPlus className="episode-button" onClick={(e) => handleEpisodesChange(e, true, watchlistMovie.id)}/>
            <FaMinus className="episode-button" onClick={(e) => handleEpisodesChange(e, false, watchlistMovie.id)}/>
        </div>
        <button className="watchlist-button"
        onClick={(e) => handleReview(e, watchlistMovie, watchlistMovie.has_review)}>{watchlistMovie.has_review ? "Посмотреть отзыв" : "Оставить отзыв"}</button>
      </div>
    </div>
  );
};

export default WatchlistItem;
