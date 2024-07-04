import { useEffect, useState } from "react";

const Board = ({
  boardSize,
  edibleCoords,
  direction,
  snakeMoves,
  edibleStatus,
  snakeLength,
}) => {
  const board = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(null)
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
  const calculateBend = (x, y) => {
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

    const prevPosWrapped = {
      x: wrap(prevPos.x, boardSize),
      y: wrap(prevPos.y, boardSize),
    };
    const nextPosWrapped = {
      x: wrap(nextPos.x, boardSize),
      y: wrap(nextPos.y, boardSize),
    };

    const isBendTopRight =
      (prevPosWrapped.x === wrap(currPos.x - 1, boardSize) &&
        nextPosWrapped.y === wrap(currPos.y + 1, boardSize)) ||
      (prevPosWrapped.y === wrap(currPos.y + 1, boardSize) &&
        nextPosWrapped.x === wrap(currPos.x - 1, boardSize)) ||
      (nextPosWrapped.x === wrap(currPos.x - 1, boardSize) &&
        prevPosWrapped.y === 0 &&
        currPos.y === boardSize - 1) ||
      (currPos.x === 0 &&
        prevPosWrapped.y === wrap(currPos.y + 1, boardSize) &&
        nextPosWrapped.x === boardSize - 1);

    const isBendBottomRight =
      (prevPosWrapped.y === wrap(currPos.y - 1, boardSize) &&
        nextPosWrapped.x === wrap(currPos.x - 1, boardSize)) ||
      (prevPosWrapped.x === wrap(currPos.x - 1, boardSize) &&
        nextPosWrapped.y === wrap(currPos.y - 1, boardSize)) ||
      (prevPosWrapped.y === boardSize - 1 &&
        nextPosWrapped.x === wrap(currPos.x - 1, boardSize) &&
        currPos.y === 0) ||
      (prevPosWrapped.x === boardSize - 1 &&
        nextPosWrapped.y === wrap(currPos.y - 1, boardSize) &&
        currPos.x === 0);

    const isBendBottomLeft =
      (prevPosWrapped.x === wrap(currPos.x + 1, boardSize) &&
        nextPosWrapped.y === wrap(currPos.y - 1, boardSize)) ||
      (prevPosWrapped.y === wrap(currPos.y - 1, boardSize) &&
        nextPosWrapped.x === wrap(currPos.x + 1, boardSize)) ||
      (prevPosWrapped.x === 0 &&
        nextPosWrapped.y === wrap(currPos.y - 1, boardSize) &&
        currPos.x === boardSize - 1) ||
      (prevPosWrapped.x === wrap(currPos.x + 1, boardSize) &&
        nextPosWrapped.y === boardSize - 1 &&
        currPos.y === 0);

    const isBendTopLeft =
      (prevPosWrapped.y === wrap(currPos.y + 1, boardSize) &&
        nextPosWrapped.x === wrap(currPos.x + 1, boardSize)) ||
      (prevPosWrapped.x === wrap(currPos.x + 1, boardSize) &&
        nextPosWrapped.y === wrap(currPos.y + 1, boardSize)) ||
      (prevPosWrapped.x === wrap(currPos.x + 1, boardSize) &&
        nextPosWrapped.y === 0 &&
        currPos.y === boardSize - 1) ||
      (currPos.x === boardSize - 1 &&
        nextPosWrapped.x === 0 &&
        prevPosWrapped.y === wrap(currPos.y + 1, boardSize));

    if (isBendTopRight) return "bend-top-right";
    if (isBendBottomRight) return "bend-bottom-right";
    if (isBendBottomLeft) return "bend-bottom-left";
    if (isBendTopLeft) return "bend-top-left";

    return "";
  };
  const calculateTail = (x, y) => {
    if (snakeLength < 2) return "";
    const currPosIndex = snakeMoves.findIndex(
      (move) => move.x === x && move.y === y
    );
    if (currPosIndex === -1) return "";
    if (currPosIndex === 0) {
      return "tail " + calculateTailDirection();
    }
    return "";
  };
  const calculateTailDirection = () => {
    const wrap = (coord, max) => (coord + max) % max;
    const [tailPos, nextToTailPos] = [snakeMoves[0], snakeMoves[1]];

    const tailPosWrapped = {
      x: wrap(tailPos.x, boardSize),
      y: wrap(tailPos.y, boardSize),
    };
    const nextToTailPosWrapped = {
      x: wrap(nextToTailPos.x, boardSize),
      y: wrap(nextToTailPos.y, boardSize),
    };

    if (
      (nextToTailPosWrapped.x === wrap(tailPosWrapped.x - 1, boardSize) &&
        nextToTailPosWrapped.y === tailPosWrapped.y) ||
      (tailPosWrapped.x === 0 &&
        nextToTailPosWrapped.x === boardSize - 1 &&
        nextToTailPosWrapped.y === tailPosWrapped.y)
    )
      return "tail-left";

    if (
      (nextToTailPosWrapped.x === wrap(tailPosWrapped.x + 1, boardSize) &&
        nextToTailPosWrapped.y === tailPosWrapped.y) ||
      (tailPosWrapped.x === boardSize - 1 &&
        nextToTailPosWrapped.x === 0 &&
        nextToTailPosWrapped.y === tailPosWrapped.y)
    )
      return "tail-right";

    if (
      (nextToTailPosWrapped.y === wrap(tailPosWrapped.y - 1, boardSize) &&
        nextToTailPosWrapped.x === tailPosWrapped.x) ||
      (tailPosWrapped.y === 0 &&
        nextToTailPosWrapped.y === boardSize - 1 &&
        nextToTailPosWrapped.x === tailPosWrapped.x)
    )
      return "tail-up";

    if (
      (nextToTailPosWrapped.y === wrap(tailPosWrapped.y + 1, boardSize) &&
        nextToTailPosWrapped.x === tailPosWrapped.x) ||
      (tailPosWrapped.y === boardSize - 1 &&
        nextToTailPosWrapped.y === 0 &&
        nextToTailPosWrapped.x === tailPosWrapped.x)
    )
      return "tail-down";

    return "";
  };
  const getCellClassNames = (x, y) => {
    const isEdible = x === edibleCoords.x && y === edibleCoords.y;
    const snakeHeadIndex = snakeMoves.findIndex(
      (move) => move.x === x && move.y === y
    );
    const snakeHeadOnTop =
      snakeMoves.findLastIndex((move) => move.x === x && move.y === y) ===
      snakeMoves.length - 1;
    const hasSnake = snakeMoves.some((move) => move.x === x && move.y === y);

    return `${edibleStatus} ${isEdible ? "has-edible " : ""}${
      snakeHeadIndex === snakeMoves.length - 1 ? "snake-head " : ""
    }${
      snakeHeadIndex !== snakeMoves.length - 1 && snakeHeadOnTop
        ? "snake-head on-top "
        : ""
    }${hasSnake ? "has-snake " : ""}`;
  };
  return (
    <div className={"board " + direction}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, cellIndex) => (
            <span
              key={cellIndex}
              className={`board-cell ${getCellClassNames(cellIndex, rowIndex)}`}
            >
              <span
                className={`inside-cell ${calculateBend(
                  cellIndex,
                  rowIndex
                )} ${calculateTail(cellIndex, rowIndex)}`}
              >
                {snakeMoves.some(
                  (move) => move.x === cellIndex && move.y === rowIndex
                ) && (
                  <span className="snake-body">
                    {snakeMoves.findLastIndex(
                      (move) => move.x === cellIndex && move.y === rowIndex
                    ) ===
                      snakeMoves.length - 1 && <SnakeEyes />}
                  </span>
                )}
                {cellIndex === edibleCoords.x &&
                  rowIndex === edibleCoords.y && (
                    <img
                      src={edible.iconSrc}
                      className="icon svg edible"
                      alt="edible"
                    />
                  )}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export const SnakeEyes = () => {
  return (
    <span className="eyes">
      <span className="eye left">
        <span className="eye-icon">
          <img
            src="assets/svg-icons/close.svg"
            alt="eye"
            className="icon"
          ></img>
        </span>
      </span>
      <span className="eye right">
        <span className="eye-icon">
          <img
            src="assets/svg-icons/close.svg"
            alt="eye"
            className="icon"
          ></img>
        </span>
      </span>
    </span>
  );
};

export default Board;
