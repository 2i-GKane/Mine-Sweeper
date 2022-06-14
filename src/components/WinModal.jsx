import React from "react";

const WinModal = (props) => {

    return (
      <div className="modal" id={props.elementID}>
        <div className="modal--title">
          <h1>GAME OVER</h1>
        </div>
        <div className="modal--content">
          <h2>You won!<h5>You had a score of {props.score}!</h5></h2>
          <div className="modal--footer">
            <button onClick={props.clickAction}>Play Again</button>
          </div>
        </div>
      </div>
    )

    
}

export default WinModal;