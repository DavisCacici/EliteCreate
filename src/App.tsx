import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasDrawing from './Canvas';
import ColorPicker from './ColorPicker';

function App() {
  const [penColor, setPenColor] = useState("black")

  const HandleColorChange = (color: string) => setPenColor(color)
  

  return (
    <div className="App">
      <ColorPicker onColorChange={HandleColorChange}/>
      <CanvasDrawing penColor={penColor}/>
    </div>
  );
}

export default App;
