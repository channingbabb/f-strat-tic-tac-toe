import React from 'react';
import '../assets/Cell.css';

const Cell = ({ state, onClick, currentPlayer }) => {
    return (
        <div className="cell" onClick={onClick}>
            {state}
        </div>
    );
};

export default Cell;
