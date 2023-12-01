import React, { useState } from "react";
import "../assets/Game.css";
import * as Constants from "../warehouse/constants";
import Board from "./Board";
import Leaderboard from "./Leaderboard";
import Cookies from "universal-cookie";
import MoreInfo from "./MoreInfo";

const cookie = new Cookies();

const Game = () => {
  // Initialize board states and winners for each small board
  const initialBoardState = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
  const [boards, setBoards] = useState(initialBoardState);
  const [boardWinners, setBoardWinners] = useState(Array(9).fill(null));
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const [xwins, setXwins] = useState(cookie.get("x-won"));
  const [ywins, setYwins] = useState(cookie.get("o-won"));
  const [draws, setDraws] = useState(cookie.get("draws"));

  const resetGame = () => {
    setBoards(initialBoardState);
    setBoardWinners(Array(9).fill(null));
    setCurrentBoard(null);
    setCurrentPlayer("X");
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

        if (data[3].gameWon !== "null") {
          alert("Game Won by " + data[3].gameWon);
          setGameOver(true);
          cookie.set(
            data[3].gameWon.toLowerCase() + "_won",
            cookie.get(data[3].gameWon.toLowerCase() + "_won") + 1
          );
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
    <>
      <div className="leaderboard">
        <Leaderboard xwin={xwins} ywins={ywins} draws={draws}></Leaderboard>
      </div>
      <div className="game">
        <div className="header">
          <div className="status">Next player: {currentPlayer}</div>
          <button onClick={() => resetGame()} className="reset-button">Reset Game</button>
        </div>
        <div className="boards">
          {boards.map((boardState, index) => (
            <Board
              key={index}
              state={boardState}
              onMove={(cellIndex) => handleMove(index, cellIndex)}
              currentPlayer={currentPlayer}
              enabled={
                (currentBoard === null || currentBoard === index) && !gameOver
              }
              winner={boardWinners[index]}
            />
          ))}
        </div>
        <MoreInfo></MoreInfo>
      </div>
    </>
  );
};

export default Game;
