import React, { useState } from "react";
import "../assets/Game.css";
import * as Constants from "../warehouse/constants";
import Board from "./Board";

const Game = () => {
  // Initialize board states and winners for each small board
  const initialBoardState = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
  const [boards, setBoards] = useState(initialBoardState);
  const [boardWinners, setBoardWinners] = useState(Array(9).fill(null));
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("X");

  const resetGame = () => {
    setBoards(initialBoardState);
    setBoardWinners(Array(9).fill(null));
    setCurrentBoard(null);
    setCurrentPlayer("X");
  }

  // Function to check for winner in a board
  const checkWinner = (board) => {
    // Winning combinations
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
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
    const payload = [
      boards.map((board) =>
        board.reduce((acc, cell, index) => {
          acc[index] = cell ? cell : "null";
          return acc;
        }, {})
      ),
      {
        nextMoveBoard: boardIndex,
        nextMoveCell: cellIndex,
      },
    ];

    const endpoint = `${Constants.API_URL}tictactoe`;
    // Send a POST request to the endpoint with the payload
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        const newBoards = data[0].map((board) =>
          Object.keys(board).map((key) =>
            board[key] === "null" ? null : board[key]
          )
        );
        setBoards(newBoards);
        const boardWinner = JSON.parse(data[2].boardsWon);
        if (boardWinner) {
          setBoardWinners(boardWinner);
        }
        // console.log(boardWinner[data[1].aiMovedTo])
        if (boardWinner[data[1].aiMovedTo] == null) {
          setCurrentBoard(data[1].aiMovedTo);
        } else {
          setCurrentBoard(null);
        }

        // Switch player
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // Render game boards
  return (
    <div className="game">
      <div className="status">Next player: {currentPlayer}</div>
      <button onClick={() => resetGame()}>Reset Game</button>
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
