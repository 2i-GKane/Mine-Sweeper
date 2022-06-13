import React from "react";
import { useState, useEffect } from "react";
import { getGameBoard, getTileElements } from './Board';

import "./styling.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

function App() {
  const boardSize = 10;

  const mineCount = 10;

  const[board, setBoard] = useState(getGameBoard(boardSize, mineCount));
  const[score, setScore] = useState(0);

  const tileElements = getTileElements();
  document.querySelector(':root').style.setProperty('--board-size', boardSize);

  const handleTileClick = (posX, posY) => {
    const id = posX + "-" + posY;

    const tileElement = document.getElementById(id);
    tileElement.classList.remove("tile");
    tileElement.classList.add("tile--clicked");
  }

  return (
    <div className="App">
      <div className="container">
        <div className="window-asthetics">
          <div className="window-info">
            <h2>Minesweeper</h2>
            <FontAwesomeIcon className="end-game" icon={faRectangleXmark}/>
          </div>
          <div className="game-container">
            <div className="score-container">
              <h1 className="score" id="score">{score}</h1>
            </div>
            <br className="score-container--padding-btm"/>

            <div id="board" className="board-container">
              {tileElements.map(element => {
                const posX = element.posX;
                const posY = element.posY;

                return <div onClick={() => handleTileClick(posX, posY)} className="tile" id={posX + "-" + posY} board-size={boardSize} pos-x={posX} pos-y={posY}/>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
