import "./App.css";
import { useEffect, useRef, useState, useCallback } from "react";
import Board from "./components/Board";
import GameBanner from "./components/GameBanner";
import UserControls from "./components/UserControls";
function App() {
  useEffect(() => {
    let cachedGameInfo = localStorage.getItem("gameInfo");
    if (cachedGameInfo) {
      cachedGameInfo = JSON.parse(cachedGameInfo);
      if (cachedGameInfo.snakeLength <= 1) return;
      setHighscore(cachedGameInfo.highscore);
      setSnakeLength(cachedGameInfo.snakeLength);
      setDirection(cachedGameInfo.direction);
      setSnakeMoves(cachedGameInfo.snakeMoves);
      setGameState("continue");
      if (
        cachedGameInfo.edibleCoords.x < 0 ||
        cachedGameInfo.edibleCoords.y < 0
      ) {
        setEdibleCoords(generateRandomCoordsforItems());
      } else {
        setEdibleCoords(cachedGameInfo.edibleCoords);
      }
    }
    else{
      setGameState("not-started");
    }
  }, []);
  const snakeMoveInterval = useRef(null);
  const trafficLights = useRef(null);
  const allSpeeds = ["slow", "normal", "fast"];
  const [highscore, setHighscore] = useState(1);
  const [edibleStatus, setEdibleStatus] = useState("");
  const [lastPosition, setLastPosition] = useState();
  const [boardSize, setBoardSize] = useState(9);
  const [snakeLength, setSnakeLength] = useState(1);
  const [direction, setDirection] = useState("up");
  const [speed, setSpeed] = useState(allSpeeds[1]);
  const [moveTimer, setMoveTimer] = useState(1000);
  const [edibleCoords, setEdibleCoords] = useState({});
  const [powerUpCoords, setPowerUpCoords] = useState({});
  const [snakeMoves, setSnakeMoves] = useState([]);
  const [gameState, setGameState] = useState("");

  const storeGameInfoInCache = useCallback(() => {
    let gameInfo = {
      highscore: highscore,
      edibleCoords: edibleCoords,
      snakeLength: snakeLength,
      direction: direction,
      snakeMoves: snakeMoves,
    };
    if (gameInfo.snakeLength > 1)
      localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
  }, [highscore, edibleCoords, snakeLength, direction, snakeMoves]);

  useEffect(() => {
    if (speed === "slow") {
      setMoveTimer(600);
    } else if (speed === "normal") {
      setMoveTimer(300);
    } else if (speed === "fast") {
      setMoveTimer(100);
    }
  }, [speed]);

  const resumeGame = () => {
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
  };
  const startGame = () => {
    localStorage.removeItem("gameInfo");
    setDirection("up");
    setSnakeLength(1);
    setSnakeMoves([
      { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
    ]);
    // setPowerUpCoords(generateRandomCoordsforItems());
    setEdibleCoords(generateRandomCoordsforItems());
    setEdibleStatus("");
    resumeGame();
  };
  const generateRandomCoordsforItems = () => {
    let randomCoords = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
    if (
      snakeMoves.some(
        (snakeMove) =>
          snakeMove.x === randomCoords.x && snakeMove.y === randomCoords.y
      ) ||
      (powerUpCoords.x === randomCoords.x &&
        powerUpCoords.y === randomCoords.y) ||
      (edibleCoords.x === randomCoords.x && edibleCoords.y === randomCoords.y)
    ) {
      return generateRandomCoordsforItems();
    } else {
      return randomCoords;
    }
  };
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
    if (
      snakeHeadPosition.x === powerUpCoords.x &&
      snakeHeadPosition.y === powerUpCoords.y
    ) {
      setEdibleStatus("eaten");
      setPowerUpCoords({ x: -1, y: -1 });
      setTimeout(() => {
        setPowerUpCoords(generateRandomCoordsforItems());
      }, 1000);
    }
  };
  checkSnakeMoves();
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
    [gameState, snakeLength, snakeMoves, setDirection]
  );

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
      console.log(e.detail);
      if (e.detail.fingers === 1) {
        if (e.detail.dir === "up") handleDirectionChange("up");
        else if (e.detail.dir === "down") handleDirectionChange("down");
        else if (e.detail.dir === "left") handleDirectionChange("left");
        else if (e.detail.dir === "right") handleDirectionChange("right");
      } else if (e.detail.fingers === 2) {
        if (e.detail.dir === "up") resumeGame();
        else if (e.detail.dir === "down") setGameState("paused");
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
        let snakeHeadCoords = snakeMoves[snakeMoves.length - 1];
        setLastPosition(snakeMoves[0]);
        let newCoords = newSnakeHeadCoords(snakeHeadCoords);
        let newIndex = snakeMoves.findIndex(
          (snakeMove) =>
            snakeMove.x === newCoords.x && snakeMove.y === newCoords.y
        );
        if (newIndex !== -1 && newIndex !== 0) {
          setTimeout(() => {
            setGameState("game-lost");
            localStorage.removeItem("gameInfo");
            clearInterval(snakeMoveInterval.current);
          }, moveTimer);
        }
        if (snakeLength === boardSize * boardSize) {
          setTimeout(() => {
            setGameState("game-won");
            localStorage.removeItem("gameInfo");
            clearInterval(snakeMoveInterval.current);
          }, moveTimer);
        }
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

  return (
    <div className={`App ${gameState}`}>
      <div className="middle-container">
        <GameBanner
          gameState={gameState}
          setGameState={setGameState}
          snakeLength={snakeLength}
          startGame={startGame}
          boardSize={boardSize}
          resumeGame={resumeGame}
        />
        <div className="top-bar">
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (gameState === "playing") {
                setGameState("paused");
              } else if (gameState === "paused") {
                resumeGame();
              }
            }}
          >
            {gameState === "playing" ? (
              <img
                src="assets/svg-icons/pause.svg"
                className="icon svg"
                alt="pause"
              />
            ) : (
              <img
                src="assets/svg-icons/play.svg"
                className="icon svg"
                alt="play"
              />
            )}
          </button>
          <div
            className={`setting-container highscore ${
              snakeLength >= highscore ? "new" : ""
            }`}
          >
            <h6 className="setting-name">
              <span className="new-text">NEW</span> Highscore
            </h6>
            <div className="setting-controls">
              <span className="value">
                {highscore}
                <img
                  src="assets/svg-icons/edible/lemon.svg"
                  className="icon svg big-icon"
                  alt="asterisk"
                />
              </span>
            </div>
          </div>
          <button type="button" className="btn">
            <img
              src="assets/svg-icons/gear.svg"
              className="icon svg big-icon"
              alt="stop"
            />
          </button>
        </div>
        <div className="board-container">
          <div className="game-banner mini">
            {gameState === "paused" && (
              <div className="banner-body paused">
                <h2 className="banner-title">Paused</h2>
                <button
                  type="button"
                  className="btn board-btn"
                  onClick={() => resumeGame()}
                  autoFocus
                >
                  Resume
                  <img
                    src="assets/svg-icons/play.svg"
                    className="icon svg"
                    alt="play"
                  />
                </button>
              </div>
            )}
          </div>
          <Board
            size={boardSize}
            direction={direction}
            edibleCoords={edibleCoords}
            powerUpCoords={powerUpCoords}
            snakeMoves={snakeMoves}
            edibleStatus={edibleStatus}
            snakeLength={snakeLength}
            gameState={gameState}
            setGameState={setGameState}
          />
          <div className="traffic-lights" ref={trafficLights}>
            <span className="traffic-light red"></span>
            <span className="traffic-light orange"></span>
            <span className="traffic-light green"></span>
          </div>
        </div>
        <UserControls
          gameState={gameState}
          setGameState={setGameState}
          direction={direction}
          handleDirectionChange={handleDirectionChange}
        />
      </div>
    </div>
  );
}

export default App;
