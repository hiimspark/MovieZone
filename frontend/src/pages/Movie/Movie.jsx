import React, { useEffect, useState } from "react";
import { getSingleMovie } from "../../utils/api";
import { useParams } from "react-router-dom";

import "./Movie.css";



const Movie = () => {
    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(true);
    const { movieId } = useParams();

    useEffect(() => {
        getSingleMovie(movieId)
            .then((res) => res.json())
            .then((data) => {setMovie(data); setLoading(false);})
            .catch((err) => console.error("Failed to fetch movies:", err));
    },  [movieId]);

  return (
    <div className="movie">
      <div className="movie-content">
        <div className="movie-header">
        <img src={movie.poster} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="movie-release">Дата выхода: {new Date(movie.release_date).toLocaleDateString('ru-RU')}</p>
          <p className="movie-rating">Рейтинг кинокритиков: {movie.critic_rating}/10</p>
          <p className="movie-rating">Рейтинг пользователей: {movie.user_rating}/10</p>
          <p className="movie-description">{movie.full_description}</p>
          {movie.is_series && (
            <div className="movie-episodes">
              <h3>Эпизоды:</h3>
              <ul>
                {Object.entries(movie.episodes_count).map(([season, count]) => (
                  <li key={season}>
                    {season}: {count} серий
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="movie-trailer">
        <h2>Трейлер</h2>
        <video width="100%" controls>
          <source src={movie.trailer} type="video/mp4" muted={true}/>
          Ваш браузер не поддерживает видео.
        </video>
      </div>

      <div className="movie-reviews">
         <h2>Отзывы пользователей</h2>
        {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map((review) => (
            <div key={review.id} className="review-block">
                <div className="review-header">
                <strong>{review.username}</strong> — Оценка: {review.rating}/10
                </div>
                <p className="review-content">{review.content}</p>
                 {Math.abs(new Date(review.created_at).getTime() - new Date(review.updated_at).getTime()) < 1000 ? (
                    <p className="review-date">
                        Дата: {new Date(review.created_at).toLocaleString('ru-RU')}
                    </p>
                    ) : (
                    <p className="review-date">
                        Дата: {new Date(review.created_at).toLocaleString('ru-RU')}<br/>
                        Отзыв изменен: {new Date(review.updated_at).toLocaleString('ru-RU')}
                    </p>
                    )}
            </div>
            ))
        ) : (
            <p className="review-empty">Отзывов пока нет.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Movie;
