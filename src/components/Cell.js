import React from 'react';
import '../assets/Cell.css';

const Cell = ({ value, onClick }) => (
  <button className="cell" onClick={onClick}>
    {value}
  </button>
);

export default Cell;
