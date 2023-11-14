import React, { Component } from "react";
import Square from "./Cell";
import "../assets/Board.css";

const AI_ENABLED = true;

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            done: false,
            thinking: false,
        };
    }

    handleClick(i) {
        if (!this.state.thinking) {
            const squares = this.state.squares.slice();
            if (calculateWinner(squares) || squares[i]) {
                return;
            }
            squares[i] = this.state.xIsNext ? "X" : "O";
            this.setState({
                squares: squares,
                xIsNext: !this.state.xIsNext,
            });

            const winner = calculateWinner(squares);
            if (AI_ENABLED && !winner) {
                this.setState({ thinking: true });
                setTimeout(() => {
                    // AI makes a random move for O
                    const emptySquares = squares.reduce((acc, val, idx) => {
                        if (!val) acc.push(idx);
                        return acc;
                    }, []);
                    const randomIndex = Math.floor(Math.random() * emptySquares.length);
                    const randomSquare = emptySquares[randomIndex];
                    squares[randomSquare] = "O";
                    this.setState({
                        squares: squares,
                        xIsNext: !this.state.xIsNext,
                    });
                    const newWinner = calculateWinner(squares);
                    if (newWinner) {
                        this.props.onClick(newWinner);
                    } else if (squares.every((square) => square !== null)) {
                        this.props.onClick("CAT");
                    }
                    this.setState({ thinking: false });
                }, 500);
            } else {
                if (winner) {
                    this.props.onClick(winner);
                } else if (squares.every((square) => square !== null)) {
                    this.props.onClick("CAT");
                }
            }
        }
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        var done = false;
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = "Winner: " + winner;
            done = true;
        } else if (this.state.squares.every((square) => square !== null)) {
            status = "It's a tie!";
            done = true;
        }

        var rowContainerClass = done ? "rowContainer disabled" : "rowContainer";
        var statusClass =
            done && winner === "X"
                ? "status x"
                : done && winner === "O"
                ? "status o"
                : "status";

        return (
            <div>
                <div className={statusClass}>{status}</div>
                <div className="ai-status o">{AI_ENABLED && done && winner === "X" ? "AI sucks" : AI_ENABLED && done && winner === "O" ? "You suck" : ""}</div>
                <div className="ai-status">
                    {this.state.thinking ? "AI is thinking..." : ""}
                </div>
                <div className={rowContainerClass}>
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;

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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
