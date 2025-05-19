import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const Home = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Добро пожаловать в <span>MovieZone</span> 🎬</h1>
        <p>Следи за своими фильмами и сериалами легко и удобно.</p>
        <Link to="/register" className="hero-button">
          Присоединиться
        </Link>
      </div>
    </div>
  );
};

export default Home;
