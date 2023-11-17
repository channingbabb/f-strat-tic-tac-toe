import React, { useState } from 'react';
import Board from './Board';
import '../assets/Game.css';
import * as Constants from '../warehouse/constants';

const Game = () => {
    // Initialize board states and winners for each small board
    const initialBoardState = Array(9).fill(null).map(() => Array(9).fill(null));
    const [boards, setBoards] = useState(initialBoardState);
    const [boardWinners, setBoardWinners] = useState(Array(9).fill(null));
    const [currentBoard, setCurrentBoard] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('X');


    // Function to check for winner in a board
    const checkWinner = (board) => {
        // Winning combinations
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    // Function to handle move
    const handleMove = (boardIndex, cellIndex) => {
      if (boards[boardIndex][cellIndex] || boardWinners[boardIndex]) {
          return;
      }

      // Update board state
      const newBoards = [...boards];
      newBoards[boardIndex][cellIndex] = currentPlayer;
      setBoards(newBoards);

      // Check if the small board has a winner
      const boardWinner = checkWinner(newBoards[boardIndex]);
      if (boardWinner) {
          const newBoardWinners = [...boardWinners];
          newBoardWinners[boardIndex] = boardWinner;
          setBoardWinners(newBoardWinners);
      }

      // Set the next board
      const nextBoard = newBoards[cellIndex].every(cell => cell) || boardWinners[cellIndex] ? null : cellIndex;
      setCurrentBoard(nextBoard);

      // Switch player
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };
    // Render game boards
    return (
      <div className="game">
          <div className="status">
              Next player: {currentPlayer}
          </div>
          <div className="boards">
              {boards.map((boardState, index) => (
                  <Board 
                      key={index} 
                      state={boardState} 
                      onMove={(cellIndex) => handleMove(index, cellIndex)}
                      currentPlayer={currentPlayer}
                      enabled={currentBoard === null || currentBoard === index}
                      winner={boardWinners[index]}
                  />
              ))}
          </div>
      </div>
  );
};

export default Game;
