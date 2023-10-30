import React, { useEffect, useRef, useState } from 'react';

interface Punti{
  x: number; 
  y: number; 
color: string
}

interface DrawingState {
  [key: number]: Punti[];
}

const CanvasDrawing: React.FC<{ penColor: string }> = ({ penColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState<DrawingState>({});
  const [undos, setUndos] = useState<DrawingState>({});
  let listdrawing: Punti[] = [];
  let key: number = 0;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      contextRef.current = canvas.getContext('2d');
    }
  }, []);

  

  const undoLastAction = () => {
    const drawingKeys = Object.keys(drawing);
    if (drawingKeys.length > 0) {
      const lastKey = Number(drawingKeys[drawingKeys.length - 1]);
      const lastAction = drawing[lastKey];
      setDrawing((prevState) => {
        const { [lastKey]: _, ...newState } = prevState;
        return newState;
      });
      setUndos((prevUndos) => ({ ...prevUndos, [lastKey]: lastAction }));

      const canvas = canvasRef.current;
      const context = contextRef.current;

      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const key in drawing) {
          if (drawing.hasOwnProperty(key)) {
            const actions = drawing[key];
            for (const action of actions) {
              context.strokeStyle = action.color;
              context.beginPath();
              context.moveTo(action.x, action.y);
              context.lineTo(action.x, action.y);
              context.stroke();
            }
          }
        }
        
        // Ripristina anche le azioni in coppia da undos, se presenti
        // for (let i = 0; i < undos.length - 1; i += 2) {
        //   const action1 = undos[i];
        //   const action2 = undos[i + 1];
        //   context.strokeStyle = action1.color;
        //   context.beginPath();
        //   context.moveTo(action1.x, action1.y);
        //   context.lineTo(action2.x, action2.y);
        //   context.stroke();
        // }
      }
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const x = e.clientX - canvasRef.current!.offsetLeft;
    const y = e.clientY - canvasRef.current!.offsetTop;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);

      contextRef.current.strokeStyle = penColor;
      // setDrawing([...drawing, { x, y, color: penColor }]);
      listdrawing.push({x: x, y: y, color: penColor});
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) return;

    const x = e.clientX - canvasRef.current!.offsetLeft;
    const y = e.clientY - canvasRef.current!.offsetTop;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    // Aggiungi l'azione corrente al registro delle azioni
    // setDrawing([...drawing, { x, y, color: penColor }]);
    
    listdrawing.push({x: x, y: y, color: penColor});
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (contextRef.current) {
      contextRef.current.closePath();
      setDrawing((prevState) => ({ ...prevState, [key]: listdrawing }));
      key++;
      // listdrawing = [];
      setUndos([]);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        style={{ border: '1px solid black', background: 'white' }}
      />
      <button onClick={undoLastAction}>Annulla ultima modifica</button>
    </div>
  );
};

export default CanvasDrawing;
