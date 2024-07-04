const MiniGameBanner = ({
  gameState,
  resumeGame,
  speed,
  allSpeeds,
  setSpeed,
}) => {
  return (
    <div className="game-banner mini">
      {gameState === "paused" && (
        <div className="banner-body paused">
          <h2 className="banner-title">Paused</h2>
          <img
            src="assets/svg-icons/pause.svg"
            className="icon svg pause-icon"
            alt="pause"
          />
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
      {gameState === "settings" && (
        <div className="banner-body settings">
          <h2 className="banner-title">Settings</h2>
          <div
            className={`speed-size-setting setting-container ${
              speed === "super sonic" ? "warning" : ""
            }`}
          >
            <h6 className="setting-name">Snake speed</h6>
            <div className="setting-controls">
              <button
                type="button"
                className="btn left-btn"
                onClick={() =>
                  allSpeeds.indexOf(speed) > 0
                    ? setSpeed(allSpeeds[allSpeeds.indexOf(speed) - 1])
                    : null
                }
              >
                <img
                  src="assets/svg-icons/minus.svg"
                  className="icon svg"
                  alt="-"
                />
              </button>
              <span className="value text">{speed}</span>
              <button
                type="button"
                className="btn right-btn"
                onClick={() =>
                  allSpeeds.indexOf(speed) < allSpeeds.length - 1
                    ? setSpeed(allSpeeds[allSpeeds.indexOf(speed) + 1])
                    : null
                }
              >
                <img
                  src="assets/svg-icons/plus.svg"
                  className="icon svg"
                  alt="+"
                />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="btn board-btn"
            onClick={() => resumeGame()}
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
  );
};

export default MiniGameBanner;
