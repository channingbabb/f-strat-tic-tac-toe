import React from 'react';
import '../assets/MoreInfo.css';

const MoreInfo = () => {
    return (
        <div className="more-info">
            <h2>Strategic Tic Tac Toe</h2>
            <p>
                Strategic Tic Tac Toe is a variation of the classic Tic Tac Toe game, where the board is composed of 9 smaller Tic Tac Toe boards.
                The objective is to win three smaller Tic Tac Toe boards in a row, either horizontally, vertically, or diagonally.
            </p>
            <h3>Rules:</h3>
            <ul>
                <li>Players take turns placing their symbol (X or O) on any available cell within the active board.</li>
                <li>The active board is determined by the opponent's previous move.</li>
                <li>If a player wins a smaller Tic Tac Toe board, they gain control of the corresponding cell on the active board.</li>
                <li>If a player's move sends the opponent to a board that is already won, the opponent can choose any available board.</li>
                <li>The game ends when a player wins three smaller Tic Tac Toe boards in a row or when all boards are filled.</li>
            </ul>
        </div>
    );
};

export default MoreInfo;
