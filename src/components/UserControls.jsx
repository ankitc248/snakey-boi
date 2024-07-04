const UserControls = ({ gameState, direction, handleDirectionChange }) => {
  const DirectionButton = ({ buttonDirection }) => {
    return (
      <button
        type="button"
        className={
          `btn ${buttonDirection}-btn` +
          (direction === buttonDirection ? " active" : "")
        }
        onClick={() => handleDirectionChange(buttonDirection)}
      >
        <img
          src="assets/svg-icons/chevron-up.svg"
          className="icon svg"
          alt={buttonDirection}
        />
      </button>
    );
  };

  return (
    gameState !== "not-started" && (
      <div className="user-controls">
        <div className="control">
          <div className="setting-controls direction-controls stretched">
            <DirectionButton buttonDirection="left" />
            <div className="middle-btn-container">
              <DirectionButton buttonDirection="up" />
              <span className="empty-space">
                <img
                  src="assets/svg-icons/asterisk-circle.svg"
                  className="icon svg"
                  alt="middle"
                />
              </span>
              <DirectionButton buttonDirection="down" />
            </div>
            <DirectionButton buttonDirection="right" />
          </div>
        </div>
      </div>
    )
  );
};
export default UserControls;
