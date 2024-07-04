import "./App.css";
import { useEffect, useRef, useState, useCallback } from "react";
import Board from "./components/Board";
import GameBanner from "./components/GameBanner";
import UserControls from "./components/UserControls";
import TopBar from "./components/TopBar";
import MiniGameBanner from "./components/MiniGameBanner";

var totalTimePlayed = 0;
const allSpeedsAndTimers = [
  { label: "slow", timer: 150 },
  { label: "normal", timer: 100 },
  { label: "fast", timer: 50 },
  { label: "super sonic", timer: 20 },
];
function App() {
  const snakeMoveInterval = useRef(null);
  const trafficLights = useRef(null);
  const totalTimeRef = useRef(totalTimePlayed);
  //ALL STATES
  const [highscore, setHighscore] = useState(1);
  const [edibleStatus, setEdibleStatus] = useState("");
  const [lastPosition, setLastPosition] = useState();
  const [boardSize] = useState(9);
  const [snakeLength, setSnakeLength] = useState(10);
  const [direction, setDirection] = useState("up");
  const [speed, setSpeed] = useState(allSpeedsAndTimers[2].label);
  const [moveTimer, setMoveTimer] = useState(allSpeedsAndTimers[2].timer);
  const [edibleCoords, setEdibleCoords] = useState({});
  const [snakeMoves, setSnakeMoves] = useState([]);
  const [gameState, setGameState] = useState("");

  //FUNCTION DECLARATIONS
  const storeGameInfoInCache = useCallback(() => {
    let gameInfo = {
      edibleCoords: edibleCoords,
      snakeLength: snakeLength,
      direction: direction,
      snakeMoves: snakeMoves,
      totalTimePlayed: totalTimePlayed,
    };
    if (gameInfo.snakeLength > 1)
      localStorage.setItem("snakey-boi-info", JSON.stringify(gameInfo));
    localStorage.setItem(
      "snakey-boi-settings",
      JSON.stringify({ highscore: highscore, speed: speed })
    );
  }, [highscore, edibleCoords, snakeLength, direction, snakeMoves, speed]);

  const resumeGame = useCallback(() => {
    setGameState("resuming");
    let timer = 500;
    setTimeout(() => {
      trafficLights.current.classList.add("red");
    }, timer);
    setTimeout(() => {
      trafficLights.current.classList.add("orange");
    }, timer * 2);
    setTimeout(() => {
      trafficLights.current.classList.add("green");
    }, timer * 3);
    setTimeout(() => {
      trafficLights.current.className = "traffic-lights";
      setGameState("playing");
    }, timer * 4);
  }, [setGameState]);

  const endGame = useCallback(
    (type) => {
      setGameState("game-ended " + type);
      clearInterval(snakeMoveInterval.current);
      setTimeout(() => {
        setGameState(type);
        localStorage.removeItem("snakey-boi-info");
        localStorage.setItem(
          "snakey-boi-settings",
          JSON.stringify({ highscore: highscore, speed: speed })
        );
      }, 3000);
    },
    [highscore, speed]
  );

  const generateRandomCoordsforItems = useCallback(() => {
    let randomCoords = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
    if (
      snakeMoves.some(
        (snakeMove) =>
          snakeMove.x === randomCoords.x && snakeMove.y === randomCoords.y
      ) ||
      (edibleCoords.x === randomCoords.x && edibleCoords.y === randomCoords.y)
    ) {
      return generateRandomCoordsforItems();
    } else {
      return randomCoords;
    }
  }, [boardSize, snakeMoves, edibleCoords]);

  const startGame = useCallback(() => {
    localStorage.removeItem("snakey-boi-info");
    setDirection("up");
    setSnakeLength(1);
    setSnakeMoves([
      { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
    ]);
    setEdibleCoords(generateRandomCoordsforItems());
    setEdibleStatus("");
    resumeGame();
  }, [
    resumeGame,
    boardSize,
    setEdibleCoords,
    setEdibleStatus,
    setSnakeMoves,
    setSnakeLength,
    setDirection,
    generateRandomCoordsforItems,
  ]);

  const newSnakeHeadCoords = useCallback(
    (snakeHeadCoords) => {
      switch (direction) {
        case "up":
          return {
            x: snakeHeadCoords.x,
            y: snakeHeadCoords.y > 0 ? snakeHeadCoords.y - 1 : boardSize - 1,
          };
        case "down":
          return {
            x: snakeHeadCoords.x,
            y: snakeHeadCoords.y < boardSize - 1 ? snakeHeadCoords.y + 1 : 0,
          };
        case "left":
          return {
            x: snakeHeadCoords.x > 0 ? snakeHeadCoords.x - 1 : boardSize - 1,
            y: snakeHeadCoords.y,
          };
        case "right":
          return {
            x: snakeHeadCoords.x < boardSize - 1 ? snakeHeadCoords.x + 1 : 0,
            y: snakeHeadCoords.y,
          };
        default:
          return snakeHeadCoords;
      }
    },
    [boardSize, direction]
  );

  const checkSnakeMoves = () => {
    if (!snakeMoves.length) return;
    const snakeHeadPosition = snakeMoves[snakeMoves.length - 1];
    if (
      snakeHeadPosition.x === edibleCoords.x &&
      snakeHeadPosition.y === edibleCoords.y
    ) {
      setEdibleStatus("eaten");
      setEdibleCoords({ x: -1, y: -1 });
      setSnakeLength((s) => s + 1);
      setSnakeMoves((prev) => [lastPosition, ...prev]);
      setTimeout(() => {
        setEdibleCoords(generateRandomCoordsforItems());
      }, 1000);
      setTimeout(() => {
        setEdibleStatus("");
      }, 300);
    }
  };

  //Snake direction handling
  const handleDirectionChange = useCallback(
    (direction) => {
      if (gameState !== "playing") return;
      if (snakeLength > 1) {
        const snakeHeadPosition = snakeMoves[snakeMoves.length - 1];
        const secondLastMove = snakeMoves[snakeMoves.length - 2];
        if (secondLastMove !== undefined) {
          let oppositeDirection = "";
          // Wrapping logic
          const wrap = (coord, max) => (coord + max) % max;

          const wrappedSnakeHeadX = wrap(snakeHeadPosition.x, boardSize);
          const wrappedSnakeHeadY = wrap(snakeHeadPosition.y, boardSize);
          const wrappedSecondLastMoveX = wrap(secondLastMove.x, boardSize);
          const wrappedSecondLastMoveY = wrap(secondLastMove.y, boardSize);

          // Check for opposite direction based on previous move
          if (
            (wrappedSnakeHeadX === wrap(secondLastMove.x + 1, boardSize) &&
              wrappedSnakeHeadY === wrappedSecondLastMoveY) ||
            (wrappedSnakeHeadX === 0 &&
              secondLastMove.x === boardSize - 1 &&
              wrappedSnakeHeadY === wrappedSecondLastMoveY)
          ) {
            oppositeDirection = "left";
          } else if (
            (wrappedSnakeHeadX === wrap(secondLastMove.x - 1, boardSize) &&
              wrappedSnakeHeadY === wrappedSecondLastMoveY) ||
            (wrappedSnakeHeadX === boardSize - 1 &&
              secondLastMove.x === 0 &&
              wrappedSnakeHeadY === wrappedSecondLastMoveY)
          ) {
            oppositeDirection = "right";
          } else if (
            (wrappedSnakeHeadY === wrap(secondLastMove.y + 1, boardSize) &&
              wrappedSnakeHeadX === wrappedSecondLastMoveX) ||
            (wrappedSnakeHeadY === 0 &&
              secondLastMove.y === boardSize - 1 &&
              wrappedSnakeHeadX === wrappedSecondLastMoveX)
          ) {
            oppositeDirection = "up";
          } else if (
            (wrappedSnakeHeadY === wrap(secondLastMove.y - 1, boardSize) &&
              wrappedSnakeHeadX === wrappedSecondLastMoveX) ||
            (wrappedSnakeHeadY === boardSize - 1 &&
              secondLastMove.y === 0 &&
              wrappedSnakeHeadX === wrappedSecondLastMoveX)
          ) {
            oppositeDirection = "down";
          }
          if (oppositeDirection !== direction) {
            setDirection(direction);
          } else {
            return;
          }
        } else {
          setDirection(direction);
        }
      } else {
        setDirection(direction);
      }
    },
    [gameState, snakeLength, snakeMoves, setDirection, boardSize]
  );

  //Speed and timer interval timer change
  const handleSpeedChange = useCallback(
    (speedAndTime) => {
      setSpeed(speedAndTime.label);
      setMoveTimer(speedAndTime.timer);
    },
    [setMoveTimer, setSpeed]
  );

  //USE EFFECTS

  //Direction event listeners
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "ArrowUp" || e.key === "w") {
        handleDirectionChange("up");
      } else if (e.key === "ArrowDown" || e.key === "s") {
        handleDirectionChange("down");
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        handleDirectionChange("left");
      } else if (e.key === "ArrowRight" || e.key === "d") {
        handleDirectionChange("right");
      } else if (e.key === "Escape") {
        if (gameState === "paused") {
          resumeGame();
        } else if (gameState === "playing") {
          setGameState("paused");
        }
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    const handleSwipe = (e) => {
      if (e.detail.fingers === 1) {
        if (e.detail.dir === "up") handleDirectionChange("up");
        else if (e.detail.dir === "down") handleDirectionChange("down");
        else if (e.detail.dir === "left") handleDirectionChange("left");
        else if (e.detail.dir === "right") handleDirectionChange("right");
      } else if (e.detail.fingers === 2) {
        if (e.detail.dir === "up" && gameState === "paused") resumeGame();
        else if (e.detail.dir === "down" && gameState === "playing")
          setGameState("paused");
      }
    };

    document.addEventListener("swiped", handleSwipe);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("swiped", handleSwipe);
    };
  }, [handleDirectionChange, gameState, resumeGame, setGameState]);

  //Snake Move Interval
  useEffect(() => {
    const moveSnake = () => {
      if (gameState === "playing") {
        totalTimePlayed += moveTimer;
        totalTimeRef.current = totalTimePlayed;
        let snakeHeadCoords = snakeMoves[snakeMoves.length - 1];
        setLastPosition(snakeMoves[0]);
        let newCoords = newSnakeHeadCoords(snakeHeadCoords);
        let newIndex = snakeMoves.findIndex(
          (snakeMove) =>
            snakeMove.x === newCoords.x && snakeMove.y === newCoords.y
        );
        if (newIndex !== -1 && newIndex !== 0) endGame("game-lost");

        if (snakeLength === boardSize * boardSize) endGame("game-won");

        if (snakeMoves.length >= snakeLength) {
          setSnakeMoves((prev) => [...prev.slice(1), newCoords]);
        } else {
          setSnakeMoves((prev) => [...prev, newCoords]);
        }
        if (snakeLength > highscore) setHighscore(snakeLength);
        storeGameInfoInCache();
      }
    };
    snakeMoveInterval.current = setInterval(moveSnake, moveTimer);
    return () => clearInterval(snakeMoveInterval.current);
  }, [
    boardSize,
    gameState,
    moveTimer,
    newSnakeHeadCoords,
    snakeLength,
    snakeMoves,
    highscore,
    setHighscore,
    storeGameInfoInCache,
    endGame,
  ]);

  //Window loses focus event listener
  useEffect(() => {
    const handleBlur = () => {
      if (document.visibilityState === "hidden" && gameState === "playing")
        setGameState("paused");
    };
    document.addEventListener("visibilitychange", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleBlur);
    };
  }, [gameState]);

  //Loading game info from cache
  useEffect(() => {
    let cachedGameInfo = localStorage.getItem("snakey-boi-info");
    let cachedGameSettings = localStorage.getItem("snakey-boi-settings");
    if (cachedGameSettings) {
      cachedGameSettings = JSON.parse(cachedGameSettings);
      setHighscore(cachedGameSettings.highscore);
      setSpeed(cachedGameSettings.speed);
    }
    if (cachedGameInfo) {
      cachedGameInfo = JSON.parse(cachedGameInfo);
      if (cachedGameInfo.snakeLength <= 1) return;
      setSnakeLength(cachedGameInfo.snakeLength);
      setDirection(cachedGameInfo.direction);
      setSnakeMoves(cachedGameInfo.snakeMoves);
      setGameState("continue");
      totalTimePlayed = cachedGameInfo.totalTimePlayed;
      if (
        cachedGameInfo.edibleCoords.x < 0 ||
        cachedGameInfo.edibleCoords.y < 0
      ) {
        setEdibleCoords(generateRandomCoordsforItems());
      } else {
        setEdibleCoords(cachedGameInfo.edibleCoords);
      }
    } else {
      setGameState("not-started");
    }
  }, []);

  checkSnakeMoves();

  return (
    <div className={`App ${gameState}`}>
      <div className="middle-container">
        <GameBanner
          gameState={gameState}
          snakeLength={snakeLength}
          startGame={startGame}
          resumeGame={resumeGame}
          boardSize={boardSize}
          totalTimePlayed={totalTimeRef}
        />
        <TopBar
          gameState={gameState}
          resumeGame={resumeGame}
          highscore={highscore}
          snakeLength={snakeLength}
          setGameState={setGameState}
        />
        <div className="board-container">
          <MiniGameBanner
            gameState={gameState}
            resumeGame={resumeGame}
            speed={speed}
            allSpeedsAndTimers={allSpeedsAndTimers}
            handleSpeedChange={handleSpeedChange}
          />
          <Board
            snakeMoves={snakeMoves}
            boardSize={boardSize}
            edibleCoords={edibleCoords}
            direction={direction}
            edibleStatus={edibleStatus}
            snakeLength={snakeLength}
          />
          <div className="traffic-lights" ref={trafficLights}>
            <span className="traffic-light red"></span>
            <span className="traffic-light orange"></span>
            <span className="traffic-light green"></span>
          </div>
        </div>
        <UserControls
          gameState={gameState}
          direction={direction}
          handleDirectionChange={handleDirectionChange}
        />
      </div>
    </div>
  );
}

export default App;
