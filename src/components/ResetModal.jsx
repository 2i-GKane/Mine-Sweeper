import React from "react";

const ResetModal = (props) => {

  const hideModal = () => {
    const modalElem = document.getElementById(props.elementID);
    modalElem.style.display = "none";

    props.secondaryAction();
  }

    return (
      <div className="modal" id={props.elementID}>
        <div className="modal--title">
          <h1>Reset</h1>
        </div>
        <div className="modal--content">
          <h2>Are you sure you want to reset?</h2>
          <div className="modal--footer">
            <button onClick={props.clickAction}>Yes</button>
            <button onClick={() => hideModal()}>No</button>
          </div>
        </div>
      </div>
    )

    
}

export default ResetModal;