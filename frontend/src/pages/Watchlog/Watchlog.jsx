import React, { useEffect, useState } from "react";
import { getWatchlog, changeStatus, changeEpisodes } from "../../utils/api";
import WatchlistItem from '../../components/WatchlistItem/WatchlistItem'
import ReviewModal from "../../components/ReviewModal/ReviewModal";
import "./Watchlog.css";


const Watchlog = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeReview, setActiveReview] = useState(null);
    const [activeHasReview, setActiveHasReview] = useState(false);

    const handleReview = (e, review, hasReview) => {
        e.stopPropagation();
        setActiveReview(review);
        setActiveHasReview(hasReview);
    };

    const closeModal = () => {
        setActiveReview(null);
    };

    useEffect(() => {
        getWatchlog()
            .then((res) => res.json())
            .then((data) => {setMovies(data); setLoading(false);})
            .catch((err) => console.error("Failed to fetch movies:", err));
    },  []);

    const handleStatusChange = async (e, id) => {
        const newStatus = e.target.value;
        try {
            await changeStatus(newStatus, id);
            const res = await getWatchlog();
            const data = await res.json();
            setMovies(data);
    
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleEpisodesChange = async (e, direction, id) => {
        try {
            await changeEpisodes(direction, id);
            const res = await getWatchlog();
            const data = await res.json();
            setMovies(data);
    
        } catch (error) {
            console.error("Failed to change episodes", error);
        }
    };

    const refreshWatchlog = async () => {
        try {
            const res = await getWatchlog();
            const data = await res.json();
            setMovies(data);
        } catch (err) {
            console.error("Failed to refresh watchlog:", err);
        }
    };
    

  return (
    <div className="watchlog">
      <div className="watchlog-content">
        <h1>Дневник просмотра</h1>
        {loading ? (
        <div className="movie-block">
            {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="watchlog-skeleton"></div>
            ))}
        </div>
        ) : (
        <div className="movie-block">
            {movies.map(movie => (
            <WatchlistItem key={movie.id} 
            watchlistMovie={movie}
            handleStatusChange={handleStatusChange} 
            handleEpisodesChange={handleEpisodesChange}
            handleReview={handleReview}/>
            ))}
        </div>
        )}
      </div>
      {activeReview && (
        <ReviewModal
            watchlog={activeReview}
            hasReview={activeHasReview}
            onClose={closeModal}
            refreshWatchlog={refreshWatchlog}
        />
        )}
    </div>
  );
};

export default Watchlog;
