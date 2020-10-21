export const colors = {
  BLACK: "b",
  WHITE: "w",
  NONE: "none",
};

export const getTileInNotation = (column, row, color) => {
  return getColumnLetter(column, color) + getRowFromIndex(row, color);
};

export const shouldBeColorX = (row, column) => {
  return (
    (row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0)
  );
};

export const getTileColor = (row, column, possibleMoves, color) => {
  let tileInNotation = getTileInNotation(column, row, color);
  if (possibleMoves.some((move) => move.to === tileInNotation)) {
    return "#6e8d71";
  }
  return shouldBeColorX(row, column) ? "grey" : "silver";
};

export const getSquare = (column, row, color) => {
  return getColumnLetter(column, color) + getRowFromIndex(row, color);
};

export const getRowFromIndex = (index, color) => {
  if (color === colors.BLACK) {
    return index + 1;
  }

  return 8 - index;
};

export const getColumnLetter = (column, color) => {
  if (color === colors.WHITE) {
    switch (column) {
      case 0:
        return "a";
      case 1:
        return "b";
      case 2:
        return "c";
      case 3:
        return "d";
      case 4:
        return "e";
      case 5:
        return "f";
      case 6:
        return "g";
      case 7:
        return "h";
      default:
        return "";
    }
  } else {
    switch (column) {
      case 0:
        return "h";
      case 1:
        return "g";
      case 2:
        return "f";
      case 3:
        return "e";
      case 4:
        return "d";
      case 5:
        return "c";
      case 6:
        return "b";
      case 7:
        return "a";
      default:
        return "";
    }
  }
};

export const getDefaultBoard = () => {
  return [
    [
      { type: "r", color: "b" },
      { type: "n", color: "b" },
      { type: "b", color: "b" },
      { type: "q", color: "b" },
      { type: "k", color: "b" },
      { type: "b", color: "b" },
      { type: "n", color: "b" },
      { type: "r", color: "b" },
    ],
    [
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
    ],
    [
      { type: "r", color: "w" },
      { type: "n", color: "w" },
      { type: "b", color: "w" },
      { type: "q", color: "w" },
      { type: "k", color: "w" },
      { type: "b", color: "w" },
      { type: "n", color: "w" },
      { type: "r", color: "w" },
    ],
  ];
};
