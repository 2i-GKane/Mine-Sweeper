import React from "react";
import { useState, useEffect } from "react";
import { getGameBoard, getTileElements, getMinePositions } from './Board';

import "./styling.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleXmark, faFlag } from "@fortawesome/free-solid-svg-icons";
import LoseModal from "./components/LoseModal";
import WinModal from "./components/WinModal";
import ResetModal from "./components/ResetModal";

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

const App = () => {
  const boardSize = 10;
  const mineCount = 10;

  const[board, setBoard] = useState(getGameBoard(boardSize, mineCount));
  const[tileElements, setTileElements] = useState(getTileElements());
  const[score, setScore] = useState(0);
  const[flags, setFlags] = useState(10);
  const[remainingTiles, setRemainingTiles] = useState((boardSize*boardSize) - mineCount);
  const[gameEnded, setGameEnded] = useState(false);

  document.querySelector(':root').style.setProperty('--board-size', boardSize);

  useEffect(() => {
    checkWinStatus();
  })

  const resetGame = () => {
    window.location.reload();
  }

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
    if(!gameEnded){
      setGameEnded((isGameEnded) => !isGameEnded);
      revealAllTiles();

      if(!isWin) revealModal("modal-lose", true);
      else{
        setScore((currentScore) => currentScore + mineCount);
        revealModal("modal-win", true);
      } 
    }
    
  }

  const revealAllTiles = () => {
    for(let x = 0; x < boardSize; x++){
      for(let y = 0; y < boardSize; y++){
        const tile = board[x][y];

        const tileElem = document.getElementById(x + "-" + y);
        if(tile.isMine){
          showTileResult(x,y);
          tileElem.innerHTML = `<h2>M</h2>`;
        } else {
          let adjacentMines = 0;
          const adjacentTiles = getAdjacentTiles(x, y);

          adjacentTiles.map((adjTile) => {
              if(adjTile.isMine) adjacentMines++;
          })

          showTileResult(x,y);
          if(adjacentMines > 0){
            let textColour;
            tileElem.innerHTML = `<h2>${adjacentMines}</h2>`;
  
            if(adjacentMines == 1) textColour = "#008cff";
            else if(adjacentMines == 2) textColour = "#009c12";
            else if(adjacentMines >= 3) textColour = "#b50213";
  
            tileElem.style.color = textColour;
          }
          
        }
      }
    }

  }

  const revealModal = (id, shouldDisplay) => {
    const modal = document.getElementById(id);

    if(shouldDisplay) modal.style.display = "block";
    else modal.style.display = "none";
  }

  const displayBoard = (shouldDisplay) => {
    const boardElement = document.getElementById("board");

    if(shouldDisplay) boardElement.style.display = "block";
    else boardElement.style.display = "none";
  }

  const checkWinStatus = () => {
    if(remainingTiles <= 0 && !gameEnded) endgame(true);
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
    } else return false;
    
    return true;
  }

  const handleTileClick = (posX, posY, playerClick) => {
    const tile = board[posX][posY];
    if(!showTileResult(posX, posY)) return;
    if(gameEnded) return;

    const id = posX + "-" + posY;
    const tileElement = document.getElementById(id);
    if(tile.isFlagged) flagTile(posX, posY);

    if(!tile.isMine){
      console.log(tile);
      setScore((currentScore) => currentScore + 1);

      const adjacentTiles = getAdjacentTiles(posX, posY);
      let adjacentMinesCount = 0;

      adjacentTiles.map((adjTile) => {
        if(adjTile.isMine) adjacentMinesCount++;
      })

      if(adjacentMinesCount > 0){
        let textColour;
        tileElement.innerHTML = `<h2>${adjacentMinesCount}</h2>`;

        if(adjacentMinesCount == 1) textColour = "#008cff";
        else if(adjacentMinesCount == 2) textColour = "#009c12";
        else if(adjacentMinesCount >= 3) textColour = "#b50213";

        tileElement.style.color = textColour;

      } else {
        adjacentTiles.map((adjTile) => {
            const adjX = adjTile.x;
            const adjY = adjTile.y;

            if(!adjTile.isMine){
              if(!adjTile.isRevealed) handleTileClick(adjX, adjY, false);
              if(adjTile.isFlagged){
                const adjFlagID = "flag-" + adjX + "-" + adjY;
                adjTile.isFlagged = false;
                setFlags((currentFlags) => currentFlags + 1)
  
                const flagElem = document.getElementById(adjFlagID);
                if(flagElem !== null) flagElem.style.display = "none";
              }
            }
            
        })
      }

    } else {
      if(playerClick){
        endgame(false);
        tileElement.innerHTML = `<h2>M</h2>`;

        console.log("Clicked Mine Location: " + posX + ", " + posY)
      }
    }
  }

  const flagTile = (posX, posY) => {
    const tile = board[posX][posY];
    const titleID = posX + "-" + posY;
    const id = "flag-" + posX + "-" + posY;

    if(!document.getElementById(titleID).classList.contains("tile--clicked")){
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

  }

  return (
    <div className="App">
      <div className="container">
        <LoseModal elementID="modal-lose" score={score} clickAction={() => resetGame()}/>
        <WinModal elementID="modal-win" score={score} clickAction={() => resetGame()}/>
        <ResetModal elementID="modal-reset" score={score} clickAction={() => {resetGame()}} secondaryAction={() => displayBoard(true)}/>
        <div id="board" className="window-asthetics">
          <div className="window-info">
            <h2>Minesweeper</h2>
            <FontAwesomeIcon className="end-game" onClick={() => {if(!gameEnded){displayBoard(false); revealModal("modal-reset", true); revealModal("modal-lose", false); revealModal("modal-win", false)}}} icon={faRectangleXmark}/>
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

                return <div key={posX + "-" + posY} onClick={() => handleTileClick(posX, posY, true)} onContextMenu={() => flagTile(posX, posY)} className="tile" id={posX + "-" + posY} board-size={boardSize} pos-x={posX} pos-y={posY}><FontAwesomeIcon className="flag" id={"flag-" + posX + "-" + posY} icon={faFlag}/></div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
