import React from 'react';
import ScrollLoop from './ScrollLoop';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="scroll-container">
        <ScrollLoop>
          <div className="row scroll-item">
            <p className="one-of-three title">Don't</p>
          </div>
          <div className="row scroll-item">
            <p className="one-of-three title">Copy</p>
          </div>
          <div className="row scroll-item">
            <p className="one-of-three title">Me</p>
          </div>
          <div className="row scroll-item">
            <p className="one-of-three title">You</p>
          </div>
          <div className="row scroll-item">
            <p className="one-of-three title">Lazy</p>
          </div>
          <div className="row scroll-item">
            <p className="one-of-three title">Scroller</p>
          </div>
        </ScrollLoop>
      </div>
    </div>
  );
}

export default App;
