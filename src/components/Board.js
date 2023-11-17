import React from 'react';
import Cell from './Cell';
import '../assets/Board.css';

const Board = ({ state, onMove, currentPlayer, enabled, winner }) => {
  let boardClasses = `board ${enabled ? 'active' : ''}`;
  if (winner) {
      boardClasses += ` winner ${winner}`;
  }

  return (
      <div className={boardClasses}>
          {state && state.map((cellState, index) => (
              <Cell 
                  key={index} 
                  state={cellState} 
                  onClick={() => enabled && !winner && onMove(index)}
                  currentPlayer={currentPlayer}
              />
          ))}
      </div>
  );
};

export default Board;
