import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('black');

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
    onColorChange(color.hex);
  };

  return (
    <div>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: selectedColor,
          cursor: 'pointer',
        }}
        onClick={() => setDisplayColorPicker(!displayColorPicker)}
      />
      {displayColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            onClick={() => setDisplayColorPicker(false)}
          />
          <ChromePicker color={selectedColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
