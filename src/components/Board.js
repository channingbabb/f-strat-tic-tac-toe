import React, { Component, PureComponent } from "react";
import "../assets/Board.css";
import Square from "./Cell";

class Board extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      done: false,
      thinking: false,
      boardIndex: this.props.key,
      positions: {
        0: "null",
        1: "null",
        2: "null",
        3: "null",
        4: "null",
        5: "null",
        6: "null",
        7: "null",
        8: "null",
      },
    };
  }

  componentDidMount() {
    if (this.props.aiChooses) {
      console.log("HERE");
      const squares = this.state.squares;
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
        const newPositions = this.state.positions;
        newPositions.randomSquare = "O";
        this.setState({
          squares: squares,
          xIsNext: !this.state.xIsNext,
          positions: newPositions,
        });
        const newWinner = calculateWinner(squares);
        if (newWinner) {
          this.props.onClick(
            newPositions,
            this.props.key,
            newWinner,
            randomIndex
          );
        } else if (squares.every((square) => square !== null)) {
          this.props.onClick(newPositions, this.props.key, "CAT", randomIndex);
        } else {
          this.props.onClick(newPositions, this.props.key, null, randomIndex);
        }
        this.setState({ thinking: false });
      }, 500);
    
      this.props.setBoardData(this.state.positions);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.canChoose !== this.props.canChoose) {
      this.props.setBoardData(this.state.positions);
    }
    // console.log(prevProps);
    // console.log(this.props);
    if (this.props.aiChooses && prevProps.aiChooses !== this.props.aiChooses) {
      const squares = this.state.squares;
      this.setState({ thinking: true });
      setTimeout(() => {
        // AI makes a random move for O
        var emptySquares = [];
        for (var i = 0; i < squares.length; i++) {
          if (!squares[i]) {
            emptySquares.push(i);
          }
        }
        console.log(emptySquares);
        var randomIndex = Math.floor(Math.random() * emptySquares.length);
        var randomSquare = emptySquares[randomIndex];
        console.log(randomSquare);
        squares[randomSquare] = "O";
        const newPositions = this.state.positions;
        newPositions[randomSquare] = "O";
        this.setState({ newPositions: newPositions });
        const newWinner = calculateWinner(squares);
        if (newWinner) {
          this.props.onClick(
            this.state.positions,
            this.props.key,
            newWinner,
            randomIndex
          );
        } else if (squares.every((square) => square !== null)) {
          this.props.onClick(
            this.state.positions,
            this.props.key,
            "CAT",
            randomIndex
          );
        } else {
          this.props.onClick(
            this.state.positions,
            this.props.key,
            null,
            randomIndex
          );
        }
        this.setState({
          squares: squares,
          xIsNext: !this.state.xIsNext,
          positions: newPositions,
        });
        var chosenIndex = parseInt(randomIndex);
        this.props.setChosenBoard(chosenIndex);
        console.log("set chosen board " + randomSquare);
        this.setState({ thinking: false });
      }, 500);
    
      this.props.setBoardData(this.state.positions);
    }
  }

  handleClick(i) {
    console.log("handle click " + i);
    console.log(this.props.canChoose)
    console.log(!this.props.aiChooses)
    if (!this.state.thinking && this.props.canChoose && !this.props.aiChooses) {
      const squares = this.state.squares;
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = "X";
      const newPositions = this.state.positions;
      newPositions[i] = "X";
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        positions: newPositions,
      });

      const winner = calculateWinner(squares);
      if (this.props.aiChooses) {
      } else {
        if (winner) {
          this.props.onClick(newPositions, this.props.key, winner, i);
        } else if (squares.every((square) => square !== null)) {
          this.props.onClick(newPositions, this.props.key, "CAT", i);
        } else {
          this.props.onClick(newPositions, this.props.key, null, i);
        }
      }
      this.props.setChosenBoard(parseInt(i));
      console.log("set chosen board " + parseInt(i));
    
      this.props.setBoardData(this.state.positions);
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
      <div className={"boardContainer"}>
        <div className={statusClass}>{status}</div>
        <div className="ai-status o">
          {this.props.AI_ENABLED && done && winner === "X"
            ? "AI sucks"
            : this.props.AI_ENABLED && done && winner === "O"
            ? "You suck"
            : ""}
        </div>
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
