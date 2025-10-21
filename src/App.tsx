import React from 'react';
import './App.css';
import Header from './layout/header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Garage from './layout/garage/Garage';
import Winners from './layout/winners/Winners';

function App() {
  return (
    <BrowserRouter basename="/TheFastAndTheFurious">
      <div className="cont">
        <Header />
        <Routes>
          <Route path='/' element={<Garage />} />
          <Route path='/winners' element={<Winners />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
