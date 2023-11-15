import React, { useState } from "react";
import "../assets/Game.css";
import Board from "./Board";

// function RenderBoard(boardIndex, chosenBoard) {
//   return (
//     <Board
//       squares={boards[boardIndex]}
//       onClick={(winner) => handleClick(boardIndex, winner)}
//       canChoose={(chosenBoard === null || chosenBoard === boardIndex) && !calculateWinner(boards[boardIndex])}
//     />
//   );
// }

const AI_ENABLED = true;

  function Game() {
    const [boards, setBoards] = useState(Array(9).fill(Array(9).fill(null)));
    const [xIsNext, setXIsNext] = useState(true);
    const [winCount, setWinCount] = useState({ X: 0, O: 0, CAT: 0 }); // new state to keep track of win count
    const [chosenBoard, setChosenBoard] = useState(null); // new state to keep track of chosen board


    function handleClick(boardIndex, winner, i) {
      const newBoards = [...boards];
      const squares = [...newBoards[boardIndex]];
      newBoards[boardIndex] = squares;
      setBoards(newBoards);
      setXIsNext(!xIsNext);
      setChosenBoard(i);
    
      // update win count if there is a winner
      if (winner) {
        setWinCount((prevWinCount) => ({
          ...prevWinCount,
          [winner]: prevWinCount[winner] + 1,
        }));
      }
    }

    function calculateWinner(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c]
        ) {
          return squares[a];
        }
      }
      return null;
    }



    function renderStatus() {
      const winner = calculateWinner(boards.flat());
      if (winner) {
        return `Winner: ${winner}`;
      } else if (
        boards.every((board) => board.every((square) => square !== null))
      ) {
        return "Draw!";
      } else {
        return `Next player: ${xIsNext ? "X" : "O"}`;
      }
    }

    return (
      <div className="game">
        <div className="game-info">
          <div className="game-text-info">{renderStatus()}</div>
          <div className="game-win-count">
            X: {winCount.X} | O: {winCount.O}
          </div>
        </div>
        <div className="game-boards">
            {/** create new map */
              boards.map((board, i) => (
                <Board
                  key={i}
                  squares={board}
                  onClick={(winner, cell) => handleClick(i, winner, cell)}
                  canChoose={(chosenBoard === null || chosenBoard === i) && !calculateWinner(board)}
                  AI_ENABLED={AI_ENABLED}
                  aiChooses={AI_ENABLED && !xIsNext && (chosenBoard === null || chosenBoard === i)}
                  setChosenBoard={setChosenBoard}
                />
              ))
            }
        </div>
      </div>
    );
  }
  export default Game;
