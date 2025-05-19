import React, { useEffect, useState } from "react";
import "./ReviewModal.css";
import { createReview, updateReview, getReview } from "../../utils/api";
import { FaXmark } from "react-icons/fa6";


const ReviewModal = ({hasReview, watchlog, onClose, refreshWatchlog }) => {
  const [mode, setMode] = useState(hasReview ? "view" : "create");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(hasReview);

  useEffect(() => {
    if (hasReview) {
          setRating(watchlog.review.rating);
          setText(watchlog.review.content);
          setLoading(false);
    }   
    }, [hasReview, watchlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await createReview(rating, text, watchlog.id);
      } else if (mode === "edit") {
        await updateReview(rating, text, watchlog.review.id);
      }
      await refreshWatchlog();
      onClose();
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "view" ? "Отзыв" : mode === "edit" ? "Редактировать отзыв" : "Оставить отзыв"}</h2>

        {loading ? (
        <form>
          <p>Загрузка...</p>
        </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Оценка:<br/>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={mode === "view"}
                required
              />
            </label>

            <label>
              Текст отзыва:<br/>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={mode === "view"}
                required
              />
            </label>
          </form>
        )}
        {mode === "view" ? (
        <button type="button" onClick={() => setMode("edit")}>
            Изменить отзыв
        </button>
        ) : (
        <button type="button" onClick={handleSubmit}>
            {mode === "edit" ? "Сохранить изменения" : "Отправить отзыв"}
        </button>
        )}
        <button className="modal-close" onClick={onClose}><FaXmark/></button>
      </div>
    </div>
  );
};

export default ReviewModal;
