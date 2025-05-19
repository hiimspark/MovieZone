import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from './pages/Home/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Header from './components/Header/Header';
import Library from './pages/Library/Library';
import Movie from './pages/Movie/Movie';
import ProtectedRoute from './components/ProtectedRoute';
import Watchlog from './pages/Watchlog/Watchlog'
import './App.css';


function App() {
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div>
      <BrowserRouter>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content">
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/library" element={<Library/>}/>
            <Route exact path="/library/:movieId" element={<Movie/>}/>
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/watchlog" element={<ProtectedRoute element={<Watchlog/>}/>}/>
        </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
