const UserControls = ({ gameState, direction, handleDirectionChange }) => {
  return (
    gameState !== "not-started" && (
      <div className="user-controls">
        <div className="control">
          <div className="setting-controls direction-controls stretched">
            <DirectionButton
              buttonDirection="left"
              direction={direction}
              handleDirectionChange={handleDirectionChange}
            />
            <div className="middle-btn-container">
              <DirectionButton
                buttonDirection="up"
                direction={direction}
                handleDirectionChange={handleDirectionChange}
              />
              <span className="empty-space">
                <img
                  src="assets/svg-icons/asterisk-circle.svg"
                  className="icon svg"
                  alt="middle"
                />
              </span>
              <DirectionButton
                buttonDirection="down"
                direction={direction}
                handleDirectionChange={handleDirectionChange}
              />
            </div>
            <DirectionButton
              buttonDirection="right"
              direction={direction}
              handleDirectionChange={handleDirectionChange}
            />
          </div>
        </div>
      </div>
    )
  );
};
export default UserControls;

const DirectionButton = ({
  buttonDirection,
  direction,
  handleDirectionChange,
}) => {
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
