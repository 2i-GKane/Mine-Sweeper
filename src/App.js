import React from "react";
import { useState, useEffect } from "react";
import { getGameBoard, getTileElements } from './Board';

import "./styling.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark, faFlag } from "@fortawesome/free-solid-svg-icons";

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

const App = () => {
  const boardSize = 10;
  const mineCount = 10;

  const[board, setBoard] = useState(getGameBoard(boardSize, mineCount));
  const[score, setScore] = useState(0);
  const[flags, setFlags] = useState(10);
  const[remainingTiles, setRemainingTiles] = useState((boardSize*boardSize) - mineCount);

  const tileElements = getTileElements();
  document.querySelector(':root').style.setProperty('--board-size', boardSize);

  useEffect(() => {
    checkWinStatus();
  })

  const getAdjacentTiles = (posX, posY) => {
    const adjacentTiles = [];

    for(let x = posX-1; x < posX + 2; x++){
      for(let y = posY-1; y < posY + 2; y++){
        const currentTile = board[x]?.[y];

        if(currentTile !== undefined) adjacentTiles.push(currentTile);
      }
    }

    return adjacentTiles;
  }

  const endgame = (isWin) => {

  }

  const checkWinStatus = () => {
    if(remainingTiles <= 0) endgame(true);
  }

  const showTileResult = (posX, posY) => {
    const tile = board[posX][posY];
    if(!tile.isRevealed){
      const id = posX + "-" + posY;

      const tileElement = document.getElementById(id);
      tileElement.classList.remove("tile");
      tileElement.classList.add("tile--clicked");

      if(tile.isFlagged) flagTile(posX, posY);
      tile.isRevealed = true;

      setRemainingTiles((remainingTiles) => remainingTiles -1);
    }
    
  }

  const handleTileClick = (posX, posY) => {
    const tile = board[posX][posY];
    showTileResult(posX, posY);

    const id = posX + "-" + posY;
    const tileElement = document.getElementById(id);

    if(!tile.isMine){
      setScore((currentScore) => currentScore + 1);
      const adjacentTiles = getAdjacentTiles(posX, posY);
      let adjacentMinesCount = 0;

      adjacentTiles.map((tile) => {
        if(tile.isMine) adjacentMinesCount++;
      })

      if(adjacentMinesCount > 0){
        let textColour;
        tileElement.innerHTML = `<h1>${adjacentMinesCount}</h1>`;

        if(adjacentMinesCount == 1) textColour = "#008cff";
        else if(adjacentMinesCount == 2) textColour = "#009c12";
        else if(adjacentMinesCount >= 3) textColour = "#b50213";

        tileElement.style.color = textColour;

      } else {
        adjacentTiles.map((adjTile) => {
            const adjX = adjTile.x;
            const adjY = adjTile.y;

            if(!adjTile.isRevealed) handleTileClick(adjX, adjY);
        })
      }

    } else {
      tileElement.innerHTML = `<h1>M</h1>`;
    }
  }

  const flagTile = (posX, posY) => {
    const tile = board[posX][posY];
    const id = "flag-" + posX + "-" + posY;

      if(!tile.isFlagged){
        if(flags <= 0) return

        tile.isFlagged = true;
        setFlags((currentFlags) => currentFlags -1)
        document.getElementById(id).style.display = "block";
      } else {
        tile.isFlagged = false;
        setFlags((currentFlags) => currentFlags + 1)

        document.getElementById(id).style.display = "none";
      }

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
            <div className="stats-bar">
              <div className="score-container">
                <h1>Score: </h1>
                <h1 className="score" id="score">{score}</h1>
              </div>
              <div className="flag-container">
                <h1>Flags: </h1>
                <h1 className="flags" id="flags">{flags}</h1>
              </div>
            </div>
            <br className="score-container--padding-btm"/>

            <div id="board" className="board-container">
              {tileElements.map(element => {
                const posX = element.posX;
                const posY = element.posY;

                return <div key={posX + "-" + posY} onClick={() => handleTileClick(posX, posY)} onContextMenu={() => flagTile(posX, posY)} className="tile" id={posX + "-" + posY} board-size={boardSize} pos-x={posX} pos-y={posY}><FontAwesomeIcon className="flag" id={"flag-" + posX + "-" + posY} icon={faFlag}/></div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
