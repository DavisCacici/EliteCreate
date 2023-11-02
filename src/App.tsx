import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasDrawing from './Components/Canvas';
import Button from './Components/Button';
import ColorPicker from './Components/ColorPicker';

function App() {
  const [penColor, setPenColor] = useState("black")
  const [undo, setUndo] = useState(false); // Stato per il pulsante undo
  const HandleColorChange = (color: string) => setPenColor(color)
  const handleUndo = () => {
    setUndo(!undo);
  };

  return (
    <div className="App">
      <div>
        <ColorPicker onColorChange={HandleColorChange}/>
        <Button onClick={handleUndo}/>
      </div>
      <CanvasDrawing penColor={penColor} undo={undo}/>
      
    </div>
  );
}

export default App;
