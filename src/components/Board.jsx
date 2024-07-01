import { useEffect, useState } from "react";

const Board = ({
  size,
  edibleCoords,
  direction,
  powerUpCoords,
  snakeMoves,
  edibleStatus,
  snakeLength,
}) => {
  // Create a 2D array to represent the board
  const board = Array.from({ length: size }, () => Array(size).fill(null));
  const powerUps = [
    { type: "fast", iconSrc: "assets/svg-icons/power-up/running-run.svg" },
    { type: "slow", iconSrc: "assets/svg-icons/power-up/turtle.svg" },
    // { type: "star", iconSrc: "assets/svg-icons/power-up/star.svg" },
  ];
  const [powerUp, setPowerUp] = useState(
    powerUps[Math.floor(Math.random() * powerUps.length)]
  );
  const [edible, setEdible] = useState();
  useEffect(() => {
    const edibles = [
      { type: "lemon", iconSrc: "assets/svg-icons/edible/lemon.svg" },
      { type: "watermelon", iconSrc: "assets/svg-icons/edible/watermelon.svg" },
      { type: "sushi", iconSrc: "assets/svg-icons/edible/sushi.svg" },
    ];
    setEdible(edibles[Math.floor(Math.random() * edibles.length)]);
  }, [snakeLength, setEdible]);
  return (
    <div className={"board " + direction}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, cellIndex) => (
            <span
              key={cellIndex}
              className={`board-cell ${edibleStatus} ${
                cellIndex === edibleCoords.x && rowIndex === edibleCoords.y
                  ? "has-edible "
                  : ""
              }${
                cellIndex === powerUpCoords.x && rowIndex === powerUpCoords.y
                  ? "has-power-up "
                  : ""
              }${
                snakeMoves.findIndex(
                  (move) => move.x === cellIndex && move.y === rowIndex
                ) ===
                snakeMoves.length - 1
                  ? "snake-head "
                  : ""
              }${
                snakeMoves.findIndex(
                  (move) => move.x === cellIndex && move.y === rowIndex
                ) !==
                  snakeMoves.length - 1 &&
                snakeMoves.findLastIndex(
                  (move) => move.x === cellIndex && move.y === rowIndex
                ) ===
                  snakeMoves.length - 1
                  ? "snake-head on-top "
                  : ""
              }${
                snakeMoves.some(
                  (move) => move.x === cellIndex && move.y === rowIndex
                )
                  ? "has-snake "
                  : ""
              }`}
            >
              <span
                className={`inside-cell ${calculateBend(
                  cellIndex,
                  rowIndex,
                  snakeMoves,
                  snakeLength,
                  size
                )} ${calculateTail(
                  cellIndex,
                  rowIndex,
                  snakeMoves,
                  snakeLength,
                  size
                )}`}
              >
                {snakeMoves.some(
                  (move) => move.x === cellIndex && move.y === rowIndex
                ) && <span className="snake-body"></span>}
                {cellIndex === edibleCoords.x &&
                  rowIndex === edibleCoords.y && (
                    <img
                      src={edible.iconSrc}
                      className="icon svg edible"
                      alt="edible"
                    />
                  )}
                {cellIndex === powerUpCoords.x &&
                  rowIndex === powerUpCoords.y && (
                    <span className="power-up">
                      <img
                        src={powerUp.iconSrc}
                        className="icon svg power-up-icon"
                        alt="power-up"
                      />
                      <img
                        src="assets/svg-icons/power-up/hourglass.svg"
                        className="icon svg hourglass"
                        alt="power-up"
                      />
                    </span>
                  )}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const calculateBend = (x, y, snakeMoves, snakeLength, size) => {
  if (snakeLength < 2) return "";

  const wrap = (coord, max) => (coord + max) % max;

  const currPos = { x, y };
  const currPosIndex = snakeMoves.findIndex(
    (move) => move.x === x && move.y === y
  );

  if (
    currPosIndex === -1 ||
    currPosIndex === 0 ||
    currPosIndex === snakeMoves.length - 1
  )
    return "";

  const prevPos = snakeMoves[currPosIndex - 1];
  const nextPos = snakeMoves[currPosIndex + 1];

  const prevPosWrapped = { x: wrap(prevPos.x, size), y: wrap(prevPos.y, size) };
  const nextPosWrapped = { x: wrap(nextPos.x, size), y: wrap(nextPos.y, size) };

  const isBendTopRight =
    (prevPosWrapped.x === wrap(currPos.x - 1, size) &&
      nextPosWrapped.y === wrap(currPos.y + 1, size)) ||
    (prevPosWrapped.y === wrap(currPos.y + 1, size) &&
      nextPosWrapped.x === wrap(currPos.x - 1, size)) ||
    (nextPosWrapped.x === wrap(currPos.x - 1, size) &&
      prevPosWrapped.y === 0 &&
      currPos.y === size - 1) ||
    (currPos.x === 0 &&
      prevPosWrapped.y === wrap(currPos.y + 1, size) &&
      nextPosWrapped.x === size - 1);

  const isBendBottomRight =
    (prevPosWrapped.y === wrap(currPos.y - 1, size) &&
      nextPosWrapped.x === wrap(currPos.x - 1, size)) ||
    (prevPosWrapped.x === wrap(currPos.x - 1, size) &&
      nextPosWrapped.y === wrap(currPos.y - 1, size)) ||
    (prevPosWrapped.y === size - 1 &&
      nextPosWrapped.x === wrap(currPos.x - 1, size) &&
      currPos.y === 0) ||
    (prevPosWrapped.x === size - 1 &&
      nextPosWrapped.y === wrap(currPos.y - 1, size) &&
      currPos.x === 0);

  const isBendBottomLeft =
    (prevPosWrapped.x === wrap(currPos.x + 1, size) &&
      nextPosWrapped.y === wrap(currPos.y - 1, size)) ||
    (prevPosWrapped.y === wrap(currPos.y - 1, size) &&
      nextPosWrapped.x === wrap(currPos.x + 1, size)) ||
    (prevPosWrapped.x === 0 &&
      nextPosWrapped.y === wrap(currPos.y - 1, size) &&
      currPos.x === size - 1) ||
    (prevPosWrapped.x === wrap(currPos.x + 1, size) &&
      nextPosWrapped.y === size - 1 &&
      currPos.y === 0);

  const isBendTopLeft =
    (prevPosWrapped.y === wrap(currPos.y + 1, size) &&
      nextPosWrapped.x === wrap(currPos.x + 1, size)) ||
    (prevPosWrapped.x === wrap(currPos.x + 1, size) &&
      nextPosWrapped.y === wrap(currPos.y + 1, size)) ||
    (prevPosWrapped.x === wrap(currPos.x + 1, size) &&
      nextPosWrapped.y === 0 &&
      currPos.y === size - 1) ||
    (currPos.x === size - 1 &&
      nextPosWrapped.x === 0 &&
      prevPosWrapped.y === wrap(currPos.y + 1, size));

  if (isBendTopRight) return "bend-top-right";
  if (isBendBottomRight) return "bend-bottom-right";
  if (isBendBottomLeft) return "bend-bottom-left";
  if (isBendTopLeft) return "bend-top-left";

  return "";
};
const calculateTail = (x, y, snakeMoves, snakeLength, size) => {
  if (snakeLength < 2) return "";
  const currPosIndex = snakeMoves.findIndex(
    (move) => move.x === x && move.y === y
  );
  if (currPosIndex === -1) return "";
  if (currPosIndex === 0) {
    return "tail " + calculateTailDirection(snakeMoves, size);
  }
};

const calculateTailDirection = (snakeMoves, size) => {
  const wrap = (coord, max) => (coord + max) % max;
  const [tailPos, nextToTailPos] = [snakeMoves[0], snakeMoves[1]];

  const tailPosWrapped = { x: wrap(tailPos.x, size), y: wrap(tailPos.y, size) };
  const nextToTailPosWrapped = {
    x: wrap(nextToTailPos.x, size),
    y: wrap(nextToTailPos.y, size),
  };

  if (
    (nextToTailPosWrapped.x === wrap(tailPosWrapped.x - 1, size) &&
      nextToTailPosWrapped.y === tailPosWrapped.y) ||
    (tailPosWrapped.x === 0 &&
      nextToTailPosWrapped.x === size - 1 &&
      nextToTailPosWrapped.y === tailPosWrapped.y)
  )
    return "tail-left";

  if (
    (nextToTailPosWrapped.x === wrap(tailPosWrapped.x + 1, size) &&
      nextToTailPosWrapped.y === tailPosWrapped.y) ||
    (tailPosWrapped.x === size - 1 &&
      nextToTailPosWrapped.x === 0 &&
      nextToTailPosWrapped.y === tailPosWrapped.y)
  )
    return "tail-right";

  if (
    (nextToTailPosWrapped.y === wrap(tailPosWrapped.y - 1, size) &&
      nextToTailPosWrapped.x === tailPosWrapped.x) ||
    (tailPosWrapped.y === 0 &&
      nextToTailPosWrapped.y === size - 1 &&
      nextToTailPosWrapped.x === tailPosWrapped.x)
  )
    return "tail-up";

  if (
    (nextToTailPosWrapped.y === wrap(tailPosWrapped.y + 1, size) &&
      nextToTailPosWrapped.x === tailPosWrapped.x) ||
    (tailPosWrapped.y === size - 1 &&
      nextToTailPosWrapped.y === 0 &&
      nextToTailPosWrapped.x === tailPosWrapped.x)
  )
    return "tail-down";

  return "";
};

export default Board;
