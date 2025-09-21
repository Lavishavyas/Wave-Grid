// src/App.js
import React from 'react';
import Grid from './components/grid';
import './App.css';

function App() {
  return (
    <div className="App">
      <h2>Interactive Wave Grid ⚡</h2>
      <Grid rows={15} cols={20} />
    </div>
  );
}

export default App;