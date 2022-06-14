let gameBoard = [];
let tileElements = [];
let minePositions = []

const getTileElements = () => {
    return tileElements;
}

const getMinePositions = () => {
    return minePositions;
}

const getMines = (boardSize, mines) => {
    minePositions = [];

    while(minePositions.length < mines){
        const randX = Math.floor(Math.random() * boardSize);
        const randY = Math.floor(Math.random() * boardSize);

        const mine = {
            x: randX,
            y: randY
        }

        if(!minePositions.includes({ mine })){
            minePositions.push(mine);
        }
    }

    return minePositions;
}

function checkIsMine(tile, mines){
    let isMine = false;

    mines.map(minePos => {
        const minePosX = minePos.x;
        const minePosY = minePos.y;

        if(tile.x === minePosX && tile.y === minePosY) isMine = true;
    })

    return isMine;
}

const createTileElement = (tileX, tileY) => {
    const tileElement = {
        posX: tileX,
        posY: tileY
    }
    return tileElement;
}

const getGameBoard = (size, mines) => {
    if(mines > size) mines = size;
    const currentMinePositions = getMines(size, mines);

    tileElements = [];
    gameBoard = [];

    for(let posX = 0; posX < size; posX++){
        let currentRow = [];
        for(let posY = 0; posY < size; posY++){

            const isMine = checkIsMine({x: posX, y: posY}, currentMinePositions);
            const tileElement = createTileElement(posX, posY);

            tileElements.push(tileElement);

            const gameTile = {
                x: posX,
                y: posY,
                isMine: isMine,
                isRevealed: false,
                isFlagged: false
            }

            currentRow.push(gameTile);
        }

        gameBoard.push(currentRow);
        
    }


    return gameBoard;
}



export { getGameBoard, getTileElements, getMinePositions, checkIsMine };