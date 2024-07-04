const TopBar = ({
  gameState,
  resumeGame,
  highscore,
  snakeLength,
  setGameState,
}) => {
  return (
    <div className="top-bar">
      <button
        type="button"
        className="btn"
        onClick={() => {
          if (gameState === "playing") {
            setGameState("paused");
          } else if (gameState === "paused" || gameState === "settings") {
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
      <button
        type="button"
        className="btn"
        onClick={() =>
          gameState !== "resuming" ? setGameState("settings") : null
        }
      >
        <img
          src="assets/svg-icons/gear.svg"
          className="icon svg big-icon"
          alt="stop"
        />
      </button>
    </div>
  );
};

export default TopBar;
