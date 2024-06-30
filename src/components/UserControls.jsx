const UserControls = ({
  gameState,
  direction,
  handleDirectionChange
}) => {
  return (
    gameState !== "not-started" && (
      <div className="user-controls">
        <div className="control">
          <div className="setting-controls direction-controls stretched">
            <button
              type="button"
              className={
                "btn left-btn" + (direction === "left" ? " active" : "")
              }
              onClick={() => handleDirectionChange("left")}
            >
              <img
                src="assets/svg-icons/chevron-up.svg"
                className="icon svg"
                alt="left"
              />
            </button>
            <div className="middle-btn-container">
              <button
                type="button"
                className={"btn up-btn" + (direction === "up" ? " active" : "")}
                onClick={() => handleDirectionChange("up")}
              >
                <img
                  src="assets/svg-icons/chevron-up.svg"
                  className="icon svg"
                  alt="up"
                />
              </button>
              <span className="empty-space">
                <img
                  src="assets/svg-icons/asterisk-circle.svg"
                  className="icon svg"
                  alt="middle"
                />
              </span>
              <button
                type="button"
                className={
                  "btn down-btn" + (direction === "down" ? " active" : "")
                }
                onClick={() => handleDirectionChange("down")}
              >
                <img
                  src="assets/svg-icons/chevron-up.svg"
                  className="icon svg"
                  alt="down"
                />
              </button>
            </div>
            <button
              type="button"
              className={
                "btn right-btn" + (direction === "right" ? " active" : "")
              }
              onClick={() => handleDirectionChange("right")}
            >
              <img
                src="assets/svg-icons/chevron-up.svg"
                className="icon svg"
                alt="right"
              />
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default UserControls;
