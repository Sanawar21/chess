import { occupiers, idToPosition, positionToId } from "../components/Square";

const nullStartingPosition = [
  { occupier: "wro", range: null },
  { occupier: "wkn", range: null },
  { occupier: "wbi", range: null },
  { occupier: "wqu", range: null },
  { occupier: "wki", range: null },
  { occupier: "wbi", range: null },
  { occupier: "wkn", range: null },
  { occupier: "wro", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "wpa", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "na", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bpa", range: null },
  { occupier: "bro", range: null },
  { occupier: "bkn", range: null },
  { occupier: "bbi", range: null },
  { occupier: "bki", range: null },
  { occupier: "bqu", range: null },
  { occupier: "bbi", range: null },
  { occupier: "bkn", range: null },
  { occupier: "bro", range: null },
];

export const startingPosition = getNewSquares(nullStartingPosition);

function findSquareHouse(position, squaresData) {
  if (
    position[0] > 0 &&
    position[0] < 9 &&
    position[1] > 0 &&
    position[1] < 9
  ) {
    let id = positionToId(position);
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

function getCutoffRange(subRange, occupierColor, squaresData) {
  let range = [];
  for (let position of subRange) {
    let house = findSquareHouse(position, squaresData);
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

function getPawnRange(occupier, position, squaresData) {
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

    if (findSquareHouse(rightDiag, squaresData) === occupiers.black) {
      range.push(rightDiag);
    }
    if (findSquareHouse(leftDiag, squaresData) === occupiers.black) {
      range.push(leftDiag);
    }
    if (findSquareHouse(top1, squaresData) === occupiers.na) {
      if (
        findSquareHouse(top2, squaresData) === occupiers.na &&
        position[1] === 2
      ) {
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

    if (findSquareHouse(rightDiag, squaresData) === occupiers.white) {
      range.push(rightDiag);
    }
    if (
      findSquareHouse(leftDiag, squaresData) === occupiers.white &&
      position[1] === 7
    ) {
      range.push(leftDiag);
    }
    if (findSquareHouse(bottom1, squaresData) === occupiers.na) {
      if (findSquareHouse(bottom2, squaresData) === occupiers.na) {
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

function getRookRange(occupier, position, squaresData) {
  let range = [];
  let moveableRange = [];

  let topRange = [];
  let bottomRange = [];
  let rightRange = [];
  let leftRange = [];

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
        occupier.startsWith("w") ? occupiers.white : occupiers.black,
        squaresData
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

function getBishopRange(occupier, position, squaresData) {
  let range = [];
  let moveableRange = [];

  let trRange = [];
  let tlRange = [];
  let brRange = [];
  let blRange = [];

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
        occupier.startsWith("w") ? occupiers.white : occupiers.black,
        squaresData
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

function getQueenRange(occupier, position, squaresData) {
  return getRookRange(occupier, position, squaresData).concat(
    getBishopRange(occupier, position, squaresData)
  );
}

function getKnightRange(occupier, position, squaresData) {
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
    let house = findSquareHouse(moveablePosition, squaresData);
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

function findSquareRange(occupier, position, squaresData) {
  let range = [];

  if (occupier === occupiers.na) {
    return null;
  } else if (occupier.endsWith("pa")) {
    range = getPawnRange(occupier, position, squaresData);
  } else if (occupier.endsWith("ro")) {
    range = getRookRange(occupier, position, squaresData);
  } else if (occupier.endsWith("bi")) {
    range = getBishopRange(occupier, position, squaresData);
  } else if (occupier.endsWith("qu")) {
    range = getQueenRange(occupier, position, squaresData);
  } else if (occupier.endsWith("kn")) {
    range = getKnightRange(occupier, position, squaresData);
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

    if (squareHouse === byHouse && square.occupier !== occupiers.na) {
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

export function getNewSquares(oldSquares) {
  // [ { occupier: "wro", range: null } ]
  let newSquares = [];
  let kingIndices = [];

  for (let i = 0; i < oldSquares.length; i++) {
    const square = oldSquares[i];

    if (!square.occupier.endsWith("ki")) {
      let range = findSquareRange(
        square.occupier,
        idToPosition(i + 1),
        oldSquares
      );
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
