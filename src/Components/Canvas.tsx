import React, { useEffect, useRef, useState } from 'react';

interface Punti{
  x: number; 
  y: number; 
color: string
}

interface DrawingState {
  [key: string]: Punti[];
}

const CanvasDrawing: React.FC<{ penColor: string; undo: boolean }> = ({ penColor, undo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState<DrawingState>({});
  var list: Punti[] = [];

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      contextRef.current = canvas.getContext('2d');
    }
  }, []);

  useEffect(() => {
    undoLastAction();
  }, [undo]);

  const undoLastAction = () => {
    const drawingKeys = Object.keys(drawing);
    if (drawingKeys.length > 0) {
      const lastKey = drawingKeys[drawingKeys.length - 1];
      setDrawing((prevState) => {
        const { [lastKey]: _, ...newState } = prevState;
        return newState;
      });
      const tempDrawing = { ...drawing };
      delete tempDrawing[lastKey];

      const canvas = canvasRef.current;
      const context = contextRef.current;

      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const key in tempDrawing) {
          if (tempDrawing.hasOwnProperty(key)) {
            const actions = tempDrawing[key];
            if (actions.length > 0) {
              const firstAction = actions[0];
              context.strokeStyle = firstAction.color;
              context.beginPath();
              context.moveTo(firstAction.x, firstAction.y);
  
              for (let i = 1; i < actions.length; i++) {
                const action = actions[i];
                context.lineTo(action.x, action.y);
                context.stroke();
              } 
              
            }
          }
        }
      }
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const x = e.clientX - canvasRef.current!.offsetLeft;
    const y = e.clientY - canvasRef.current!.offsetTop;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(
        x,
        y
      );

      contextRef.current.strokeStyle = penColor;
      list.push({x: x, y:y, color: penColor});
     
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) return;

    const x = e.clientX - canvasRef.current!.offsetLeft;
    const y = e.clientY - canvasRef.current!.offsetTop;

    contextRef.current.lineTo(
      x,
      y 
    );
    contextRef.current.stroke();
    list.push({x: x, y:y, color: penColor});
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    const ids =  Date.now().toString(); 
    setDrawing((prevState) => ({
      ...prevState,
      [ids]: list,
    }));
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
      {/* <button onClick={undoLastAction}>Annulla ultima modifica</button> */}
    </div>
  );
};

export default CanvasDrawing;
