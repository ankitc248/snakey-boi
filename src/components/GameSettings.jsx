const GameSettings = ({
  boardSize,
  setBoardSize,
  sizeLimits,
  speed,
  setSpeed,
  allSpeeds,
}) => {
  return (
    <div className="control">
      <div className="settings">
        <div className="board-size-setting setting-container">
          <h6 className="setting-name">Board Size</h6>
          <div className="setting-controls">
            <button
              type="button"
              className="btn left-btn"
              onClick={() =>
                boardSize > sizeLimits[0]
                  ? setBoardSize(boardSize - 1)
                  : boardSize
              }
            >
              <img
                src="assets/svg-icons/minus.svg"
                className="icon svg"
                alt="-"
              />
            </button>
            <span className="value">{boardSize}</span>
            <button
              type="button"
              className="btn right-btn"
              onClick={() =>
                boardSize < sizeLimits[1]
                  ? setBoardSize(boardSize + 1)
                  : boardSize
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
        <div className="speed-size-setting setting-container">
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
      </div>
    </div>
  );
};

export default GameSettings;
