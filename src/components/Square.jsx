import React from "react";

import "../styles/square.css";

// position  = [x,y]
// xy min 1 max 8
// { position, occupier, targetedBy, targeting }
export const occupiers = {
  white: {
    king: "wki",
    knight: "wkn",
    rook: "wro",
    pawn: "wpa",
    queen: "wqu",
    bishop: "wbi",
  },
  black: {
    king: "bki",
    knight: "bkn",
    rook: "bro",
    pawn: "bpa",
    queen: "bqu",
    bishop: "bbi",
  },
  na: "na",
};

export function idToPosition(id) {
  return id % 8 === 0
    ? [8, Math.floor(id / 8)]
    : [id % 8, Math.floor((8 - (id % 8) + id) / 8)];
}

export function positionToId(position) {
  return (position[1] - 1) * 8 + position[0];
}

export const Square = ({ id, occupier, moveableRange }) => {
  const position = idToPosition(id);

  return (
    <div
      className={
        (position[0] + position[1]) % 2 === 0 ? "light-square" : "dark-square"
      }
    >
      <img
        className="occupier"
        src={process.env.PUBLIC_URL + `/imgs/${occupier}.png`}
        alt="?"
      ></img>
    </div>
  );
};
