import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leaders } from "../data/leaders";

export default function LeadershipSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const next = () => {
    setIndex((i) => (i + 1) % leaders.length);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + leaders.length) % leaders.length);
  };

  useEffect(() => {
    if (paused) return;

    timerRef.current = setInterval(next, 4500);

    return () => clearInterval(timerRef.current);
  }, [paused]);

  const leader = leaders[index];

  return (
    <div
      className="leader-slide"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* CONTENT */}
      <div
        className="leader-content show"
        onClick={() => navigate(`/leader/${leader.id}`)}
      >
        <h4>{leader.name}</h4>
        <span className="leader-role">{leader.role}</span>

        <p className="leader-message">
          “{leader.message}”
        </p>

        <span className="leader-cta">View details →</span>
      </div>

      {/* CONTROLS */}
      <button className="slider-btn left" onClick={prev}>‹</button>
      <button className="slider-btn right" onClick={next}>›</button>
    </div>
  );
}
