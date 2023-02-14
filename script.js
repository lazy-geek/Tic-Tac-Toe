
//states
// 0-> not played
// 1-> selected by player 1
// 2-> selected by player 2
const boardTiles = [];



let currentTurn = 1;

const createMarker = (elemName) => {
    const elem = document.createElement('div');
    if(elemName == 'x'){
        elem.classList.add('x');
    }else{

        elem.classList.add('o')
    }

    return elem;
}

const toggleTurn = ()=>{
    if(currentTurn == 1){
        currentTurn = 2;
    }else{
        currentTurn = 1;
    }
}

let count = 1;
for(let i=0; i<3;i++){
    const row =[];
    for(let j=0; j<3;j++){

        row.push({"state":0 ,"elem": document.querySelector(`#tile_${count}`)});
        count++;
    }
    boardTiles.push(row);
}


for(let i=0; i<boardTiles.length;i++){
    for(let j=0; j<boardTiles[i].length;j++){
        boardTiles[i][j].elem.addEventListener('click',function () {
            if(boardTiles[i][j].state !== 0) return;
            boardTiles[i][j].state = currentTurn;
            boardTiles[i][j].elem.appendChild(currentTurn==1 ? createMarker('x') : createMarker('o'));
            toggleTurn();
        });
    }
}
