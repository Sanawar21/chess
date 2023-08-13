/* eslint-disable no-redeclare */

// when a piece is moved all range data will be lost and position will be updated.
// range for each piece will be calculated and updated by updateSquares

import { useEffect, useState } from "react";
import { Square, occupiers, idToPosition } from "./Square";

import "../styles/board.css";

const Board = () => {
  const [squaresData, setSquaresData] = useState([]);

  function findSquareHouse(position) {
    if (
      position[0] > 0 &&
      position[0] < 9 &&
      position[1] > 0 &&
      position[1] < 9
    ) {
      let id = idToPosition(position);
      let data = squaresData[id - 1];
      if (data.occupier.startsWith("w")) {
        return occupiers.white;
      } else if (data.occupier.startsWith("b")) {
        return occupiers.black;
      } else {
        return occupiers.na;
      }
    } else {
      return null;
    }
  }

  function getCutoffRange(subRange, occupierColor) {
    let range = [];
    for (let position of subRange) {
      let house = findSquareHouse(position);
      if (house === occupiers.na) {
        range.push(position);
      } else {
        if (house !== occupierColor) {
          range.push(house);
        }
        return range;
      }
    }
  }

  function getPawnRange(occupier, position) {
    let range = [];
    let moveableRange = [];

    if (occupier === occupiers.white.pawn) {
      let top1 = [position[0], position[1] + 1];
      let top2 = [position[0], position[1] + 2];
      let rightDiag = [position[0] + 1, position[1] + 1];
      let leftDiag = [position[0] - 1, position[1] + 1];
      var isAtTop = false;

      if (top1[1] === 9) {
        // TODO: Turn to queen
        isAtTop = true;
      }

      if (findSquareHouse(rightDiag) === occupiers.black) {
        range.push(rightDiag);
      }
      if (findSquareHouse(leftDiag) === occupiers.black) {
        range.push(leftDiag);
      }
      if (findSquareHouse(top1) === occupiers.na) {
        if (findSquareHouse(top2) === occupiers.na && position[1] === 2) {
          range.push(top2);
        }
        range.push(top1);
      }
    } else {
      let bottom1 = [position[0], position[1] - 1];
      let bottom2 = [position[0], position[1] - 2];
      let rightDiag = [position[0] + 1, position[1] - 1];
      let leftDiag = [position[0] - 1, position[1] - 1];
      var isAtBottom = false;

      if (bottom1[1] === 9) {
        // TODO: Turn to queen
        isAtBottom = true;
      }

      if (findSquareHouse(rightDiag) === occupiers.white) {
        range.push(rightDiag);
      }
      if (findSquareHouse(leftDiag) === occupiers.white && position[1] === 7) {
        range.push(leftDiag);
      }
      if (findSquareHouse(bottom1) === occupiers.na) {
        if (findSquareHouse(bottom2) === occupiers.na) {
          range.push(bottom2);
        }
        range.push(bottom1);
      }
    }

    if (!(isAtTop || isAtBottom)) {
      moveableRange = range;
    }
    return moveableRange;
  }

  function getRookRange(occupier, position) {
    let range = [];
    let moveableRange = [];

    let topRange;
    let bottomRange;
    let rightRange;
    let leftRange;

    for (let i = 1; i < 8; i++) {
      topRange.push([position[0], position[1] + i]);
    }

    for (let i = 1; i < 8; i++) {
      bottomRange.push([position[0], position[1] - i]);
    }

    for (let i = 1; i < 8; i++) {
      rightRange.push([position[0] + i, position[1]]);
    }

    for (let i = 1; i < 8; i++) {
      leftRange.push([position[0] - i, position[1]]);
    }

    let subRanges = [topRange, bottomRange, rightRange, leftRange];

    subRanges.forEach((subRange) => {
      range.concat(
        getCutoffRange(
          subRange,
          occupier.startsWith("w") ? occupiers.white : occupiers.black
        )
      );
    });

    moveableRange = range.filter((moveablePosition) => {
      return (
        moveablePosition[0] > 0 &&
        moveablePosition[0] < 9 &&
        moveablePosition[1] > 0 &&
        moveablePosition[1] < 9
      );
    });
    return moveableRange;
  }

  function getBishopRange(occupier, position) {
    let range = [];
    let moveableRange = [];

    let trRange;
    let tlRange;
    let brRange;
    let blRange;

    for (let i = 1; i < 8; i++) {
      trRange.push([position[0] + i, position[1] + i]);
    }

    for (let i = 1; i < 8; i++) {
      tlRange.push([position[0] - i, position[1] + i]);
    }

    for (let i = 1; i < 8; i++) {
      brRange.push([position[0] + i, position[1] - i]);
    }

    for (let i = 1; i < 8; i++) {
      blRange.push([position[0] - i, position[1] - i]);
    }

    let subRanges = [trRange, tlRange, brRange, blRange];

    subRanges.forEach((subRange) => {
      range.concat(
        getCutoffRange(
          subRange,
          occupier.startsWith("w") ? occupiers.white : occupiers.black
        )
      );
    });

    moveableRange = range.filter((moveablePosition) => {
      return (
        moveablePosition[0] > 0 &&
        moveablePosition[0] < 9 &&
        moveablePosition[1] > 0 &&
        moveablePosition[1] < 9
      );
    });

    return moveableRange;
  }

  function getQueenRange(occupier, position) {
    return getRookRange(occupier, position).concat(
      getBishopRange(occupier, position)
    );
  }

  function getKnightRange(occupier, position) {
    let range = [
      [position[0] + 2, position[1] - 1],
      [position[0] + 2, position[1] + 1],
      [position[0] + 1, position[1] + 3],
      [position[0] - 1, position[1] + 3],
      [position[0] - 2, position[1] + 1],
      [position[0] - 2, position[1] - 1],
      [position[0] - 1, position[1] - 3],
      [position[0] + 1, position[1] - 3],
    ];

    let ownHouse = occupier.startsWith("w") ? occupiers.white : occupiers.black;
    let moveableRange = [];

    range.forEach((moveablePosition) => {
      let house = findSquareHouse(moveablePosition);
      if (house === occupiers.na || house !== ownHouse) {
        moveableRange.push(moveablePosition);
      }
    });

    moveableRange = range.filter((moveablePosition) => {
      return (
        moveablePosition[0] > 0 &&
        moveablePosition[0] < 9 &&
        moveablePosition[1] > 0 &&
        moveablePosition[1] < 9
      );
    });

    return moveableRange;
  }

  function getKingsRanges(kingIndices, newSquares) {
    var whiteKingRange;
    var blackKingRange;
    for (var house in kingIndices) {
      if (kingIndices.hasOwnProperty(house)) {
        var index = kingIndices[house];
        let position = idToPosition(index + 1);
        var range = [
          [position[0] + 1, position[1]],
          [position[0] - 1, position[1]],
          [position[0] + 1, position[1] + 1],
          [position[0] + 1, position[1] - 1],
          [position[0] - 1, position[1] + 1],
          [position[0] - 1, position[1] - 1],
          [position[0], position[1] + 1],
          [position[0], position[1] - 1],
        ];
        if (house === "white") {
          whiteKingRange = range;
        } else {
          blackKingRange = range;
        }
      }
    }
    let whiteKingMoveable = [];
    let blackKingMoveable = [];
    [whiteKingRange, blackKingRange] = removeIntersection(
      whiteKingRange,
      blackKingRange
    );

    whiteKingRange.forEach((position) => {
      if (!isTargeted(occupiers.black, position, newSquares)) {
        whiteKingMoveable.push(position);
      }
    });
    blackKingRange.forEach((position) => {
      if (!isTargeted(occupiers.white, position, newSquares)) {
        blackKingMoveable.push(position);
      }
    });

    return [whiteKingMoveable, blackKingMoveable];
  }

  function findSquareRange(occupier, position) {
    let range = [];

    if (occupier === occupiers.na) {
      return null;
    } else if (occupier.endsWith("pa")) {
      range = getPawnRange(occupier, position);
    } else if (occupier.endsWith("ro")) {
      range = getRookRange(occupier, position);
    } else if (occupier.endsWith("bi")) {
      range = getBishopRange(occupier, position);
    } else if (occupier.endsWith("qu")) {
      range = getQueenRange(occupier, position);
    } else if (occupier.endsWith("kn")) {
      range = getKnightRange(occupier, position);
    } else {
      return [];
    }

    return range;
  }

  function isTargeted(byHouse, position, squares) {
    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      if (square === null) {
        continue;
      }
      let squareHouse = square.occupier.startsWith("w")
        ? occupiers.white
        : occupiers.black;

      if (squareHouse === byHouse) {
        if (square.range.includes(position)) {
          return true;
        }
      }
    }

    return false;
  }

  function removeIntersection(array1, array2) {
    var intersection = array1.filter((item) => array2.indexOf(item) !== -1);
    array1 = array1.filter((item) => !intersection.includes(item));
    array2 = array2.filter((item) => !intersection.includes(item));
    return [array1, array2];
  }

  function getNewSquares() {
    let oldSquares = squaresData; // [ { occupier: "wro", range: null } ]
    let newSquares = [];
    let kingIndices = [];

    for (let i = 0; i < oldSquares.length; i++) {
      const square = oldSquares[i];

      if (!square.occupier.endsWith("ki")) {
        let range = findSquareRange(square.occupier, idToPosition(i + 1));
        newSquares.push({ occupier: square.occupier, range: range });
      } else {
        newSquares.push(null);
        let house = square.occupier.startsWith("w") ? "white" : "black";
        kingIndices[house] = i;
      }
    }

    var kingsRanges = getKingsRanges(kingIndices, newSquares);

    newSquares[kingIndices["white"]] = {
      occupier: "wki",
      range: kingsRanges[0],
    };
    newSquares[kingIndices["black"]] = {
      occupier: "bki",
      range: kingsRanges[1],
    };

    return newSquares;
  }

  useEffect(() => {
    // id,
    // occupier,
    // range,
    setSquaresData([
      { occupier: "wro", range: [] },
      { occupier: "wkn", range: [] },
    ]);
  }, []);

  for (let i = 1; i <= 8 * 8; i++) {
    squares.push(<Square key={i} id={i} occupier={occupiers.black.pawn} />);
  }

  return <div className="board">{squares}</div>;
};

export default Board;
