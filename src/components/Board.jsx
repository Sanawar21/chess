/* eslint-disable no-redeclare */

// when a piece is moved all range data will be lost and position will be updated.
// range for each piece will be calculated and updated by updateSquares

import { useEffect, useState } from "react";

import { Square, occupiers } from "./Square";
import { getNewSquares, startingPosition } from "../package/chess";

import "../styles/board.css";

const Board = () => {
  const [squaresData, setSquaresData] = useState([]);

  useEffect(() => {
    // id,
    // occupier,
    // range,
    setSquaresData([startingPosition]);
  }, []);

  var squares = [];
  console.log(squaresData);
  for (let i = 1; i <= 64; i++) {
    let square = squaresData[i];
    console.log(squaresData ? square : "error");
    squares.push(<Square key={i} id={i} occupier={"na"} range={null} />);
  }

  // for (let i = 1; i <= squaresData.length; i++) {
  //   let square = squaresData[i - 1];
  //   squares.push(
  //     <Square key={i} id={i} occupier={square.occupier} range={square.range} />
  //   );
  // }

  return <div className="board">{squares}</div>;
};

export default Board;
