import { SnakeEyes } from "./Board";
const GameBanner = ({
  gameState,
  snakeLength,
  startGame,
  resumeGame,
  boardSize,
  totalTimePlayed,
}) => {
  return (
    <div className={"game-banner " + gameState}>
      {gameState === "not-started" && (
        <div className="banner-body not-started">
          <h2 className="banner-title">{WavyText("Snakey Boi")}</h2>
          <img
            src="snake.svg"
            className="icon svg logo"
            alt="snake"
            width={100}
            height={100}
          />
          <div className="help-info">
            <h1>Control snake</h1>
            <div className="keys wasd">
              <span className="key left">A</span>
              <div className="middle-part">
                <span className="key up">W</span>
                <span className="key down">S</span>
              </div>
              <span className="key right">D</span>
            </div>
            <div className="keys arrows">
              <span className="key left">
                <span className="arrow">&#8593;</span>
              </span>
              <div className="middle-part">
                <span className="key up">
                  <span className="arrow">&#8593;</span>
                </span>
                <span className="key down">
                  <span className="arrow">&#8593;</span>
                </span>
              </div>
              <span className="key right">
                <span className="arrow">&#8593;</span>
              </span>
            </div>
            <div className="keys swipe">
              <span className="key">
                <img
                  src="assets/svg-icons/swipe-left.svg"
                  className="icon svg big-icon"
                  alt="swipe"
                />
                <span>Swipe screen</span>
              </span>
            </div>
            <h1>Pause/Resume</h1>
            <div className="keys wasd">
              <span className="key">Esc</span>
            </div>
            <div className="keys swipe">
              <span className="key two-fingers">
                <img
                  src="assets/svg-icons/swipe-left.svg"
                  className="icon svg big-icon up-swipe"
                  alt="swipe"
                />
                <span>Two Fingers swipe down/up</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => startGame()}
            autoFocus
          >
            Start slythering
            <img
              src="assets/svg-icons/play.svg"
              className="icon svg"
              alt="play"
            />
          </button>
        </div>
      )}
      {gameState === "continue" && (
        <div className="banner-body continue">
          <h2 className="banner-title">Continue?</h2>
          <div className="banner-text">
            Pending game found, do you want to continue the same or start over?
          </div>
          <div className="btn-group">
            <button
              type="button"
              className="btn non-cta-btn"
              onClick={() => startGame()}
              autoFocus
            >
              Start over
              <img
                src="assets/svg-icons/undo.svg"
                className="icon svg big-icon"
                alt="restart"
              />
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => resumeGame()}
              autoFocus
            >
              Continue
              <img
                src="assets/svg-icons/play.svg"
                className="icon svg"
                alt="play"
              />
            </button>
          </div>
        </div>
      )}
      {gameState === "game-lost" && (
        <div className="banner-body game-lost up">
          <h2 className="banner-title">Game over</h2>
          <span className="board-cell snake-head on-top has-snake ">
            <span className="inside-cell">
              <span className="snake-body">
                <SnakeEyes />
              </span>
            </span>
          </span>
          <div className="banner-text">
            You grew to {snakeLength} times your original size. Needed to eat{" "}
            {+boardSize * boardSize - snakeLength}{" "}
            <img
              src="assets/svg-icons/edible/lemon.svg"
              className="icon svg big-icon food-icon"
              alt="food"
            />{" "}
            more to win. <br></br>
            <a
              href="https://www.youtube.com/watch?v=KxGRhd_iWuE"
              target="_blank"
              rel="noreferrer"
            >
              Don't give up!
            </a>
          </div>
          <button
            type="button"
            className="btn"
            autoFocus
            onClick={() => {
              startGame();
            }}
          >
            Start over
            <img
              src="assets/svg-icons/undo.svg"
              className="icon svg big-icon"
              alt="restart"
            />
          </button>
        </div>
      )}
      {gameState === "game-won" && (
        <div className="banner-body game-won">
          <h2 className="banner-title">{WavyText("You won !")}</h2>
          <div className="banner-text">
            You took{" "}
            <span className="total-time">
              {prettyTime(totalTimePlayed.current)}
            </span>{" "}
            to finish the game. Keep trying for a better time.
          </div>
          <button
            type="button"
            className="btn"
            autoFocus
            onClick={() => startGame()}
          >
            Start over
            <img
              src="assets/svg-icons/undo.svg"
              className="icon svg big-icon"
              alt="restart"
            />
          </button>
        </div>
      )}
    </div>
  );
};

const WavyText = (text) => {
  return (
    <div className="wavy-text">
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="wavy-char"
          style={{
            animationDelay: `${index * 0.1}s`,
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
const prettyTime = (milliseconds) => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${formattedSeconds}`;
};

export default GameBanner;
