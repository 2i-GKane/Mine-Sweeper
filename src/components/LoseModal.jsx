import React from "react";

const LoseModal = (props) => {

    return (
      <div className="modal" id={props.elementID}>
        <div className="modal--title">
          <h1>GAME OVER</h1>
        </div>
        <div className="modal--content">
          <h2>You uncovered a mine!</h2>
          <h4>You had a score of {props.score}!</h4>
          <div className="modal--footer">
            <button onClick={props.clickAction}>Try Again</button>
          </div>
        </div>
      </div>
    )

    
}

export default LoseModal;