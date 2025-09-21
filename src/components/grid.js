import React, { useState, useEffect } from 'react';
import './grid.css';

// Define the colors as arrays of RGB values
const colorThemes = [
  [0, 255, 0], // Green
  [0, 0, 255], // Blue
  [128, 0, 128], // Purple
];

// Simple linear interpolation function to blend colors
const lerp = (start, end, progress) => {
  return start + (end - start) * progress;
};

const Grid = ({ rows = 15, cols = 20 }) => {
  const [wavePosition, setWavePosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Effect to handle the wave's movement
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePosition(prevPos => {
        const newPos = prevPos + direction;
        if (newPos >= cols - 1) {
          setDirection(-1);
          return cols - 1;
        } else if (newPos < 0) {
          setDirection(1);
          return 0;
        }
        return newPos;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [cols, direction]);

  // Effect to handle the timed color transitions
  useEffect(() => {
    const changeColor = () => {
      let progress = 0;
      const transitionInterval = setInterval(() => {
        progress += 0.01; // Increase progress slowly
        if (progress >= 1) {
          clearInterval(transitionInterval);
          setCurrentColorIndex(prevIndex => (prevIndex + 1) % colorThemes.length);
          setTransitionProgress(0); // Reset for next transition
          setTimeout(changeColor, 14000); // Start next transition after 14 seconds
        } else {
          setTransitionProgress(progress);
        }
      }, 50);
    };

    // Start the first transition after 14 seconds
    const timerId = setTimeout(changeColor, 14000);
    return () => clearTimeout(timerId);
  }, []); // Run this effect only once on component mount

  const getSquareColor = (colIndex) => {
    const distance = Math.abs(colIndex - wavePosition);
    const glowWidth = 5;

    if (distance <= glowWidth) {
      const intensity = 1 - distance / glowWidth;
      const value = Math.floor(intensity * 255);

      // Get the current and next colors
      const currentTheme = colorThemes[currentColorIndex];
      const nextTheme = colorThemes[(currentColorIndex + 1) % colorThemes.length];

      // Blend the colors based on transitionProgress
      const r = lerp(currentTheme[0], nextTheme[0], transitionProgress);
      const g = lerp(currentTheme[1], nextTheme[1], transitionProgress);
      const b = lerp(currentTheme[2], nextTheme[2], transitionProgress);

      // Apply the glow intensity
      const finalR = Math.floor(r * intensity);
      const finalG = Math.floor(g * intensity);
      const finalB = Math.floor(b * intensity);

      return `rgb(${finalR}, ${finalG}, ${finalB})`;
    }
    
    return '#000';
  };

  return (
    <div 
      className="grid-container"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`, 
        gridTemplateRows: `repeat(${rows}, 1fr)` 
      }}
    >
      {Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="grid-square"
            style={{ backgroundColor: getSquareColor(colIndex) }}
          ></div>
        ))
      )}
    </div>
  );
};

export default Grid;