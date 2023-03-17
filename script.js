const createPopup = function (content) {
    const popup = document.querySelector('.popup-container .popup-content');
    // const popup_close = document.querySelector('.popup-container .popup-content .popup-close');
    const popup_container = document.querySelector('.popup-container');
    // popup_close.addEventListener('click',() => {
    // });
    const close_button = popup.innerHTML;
    popup.innerHTML += content;

    return {
        showPopup: function () {
            popup_container.classList.remove('hidden');

        },
        hidePopup: function () {
            popup_container.classList.add('hidden');
            popup.innerHTML = close_button;
        }
    };
}

class Board {
    constructor(size) {
        this.size = size;
        this.boardTiles = []
        // current turn
        // 1 - player 1
        // 2 - player 2
        this.currentPlayer = 1;
        this.setupBoardGrid();
        this.init();
        this.maxMoves = size * size;
        this.currentMoves = 0;
        this.player1Name = "player 1";
        this.player2Name = "player 2";

    }

    getPlayerName(num) {
        if (num == 1) {
            return this.player1Name;
        } else {
            return this.player2Name;
        }
    }
    changeSize(size) {
        document.querySelector('.board').innerHTML = ""
        this.size = size;
        this.boardTiles = []
        // current turn
        // 1 - player 1
        // 2 - player 2
        this.currentPlayer = 1;
        this.setupBoardGrid();
        this.init();
        this.maxMoves = size * size;
        this.currentMoves = 0;
    }
    createTile() {
        const elem = document.createElement('div');
        elem.classList.add("board__tile");
        return elem;
    }

    setupBoardGrid() {
        document.querySelector('.board').style.gridTemplateColumns = `repeat(${this.size},1fr)`;
        document.querySelector('.board').style.gridTemplateRows = `repeat(${this.size},1fr)`;
    }

    toggleTurn() {
        if (this.currentPlayer == 1) {
            this.currentPlayer = 2;
        } else {
            this.currentPlayer = 1;
        }
    }

    createMarker(elemName) {
        const elem = document.createElement('div');

        elem.classList.add(elemName);

        return elem;
    }

    init() {
        const boardTiles = []
        for (let i = 0; i < this.size; i++) {
            const row = [];
            for (let j = 0; j < this.size; j++) {

                row.push({ "state": 0, "elem": this.createTile() });
                document.querySelector('.board').appendChild(row[j].elem)
            }

            boardTiles.push(row);
        }

        this.boardTiles = boardTiles;
        this.setupEventListeners();

    }
    resetGame() {
        this.currentMoves = 0;
        this.currentPlayer = 1;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {


                this.boardTiles[i][j].elem.remove();

            }
        }
        this.init();
    }

    checkGameOver() {
        if (this.currentMoves === this.maxMoves) {
            console.log("gameOver - Draw");
            setTimeout(() => {
                window.alert("gameOver - Draw")

                this.resetGame();
            }, 100);
            return;
        }
    }
    makeMove(i, j) {
        if (this.boardTiles[i][j].state != 0) return;

        this.boardTiles[i][j].state = this.currentPlayer;
        this.currentMoves++;
        this.boardTiles[i][j].elem.appendChild(this.currentPlayer == 1 ? this.createMarker('player1') : this.createMarker('player2'));
        const winner = this.checkWinner();
        if (winner.winner == this.currentPlayer) {
            console.log(this.getPlayerName(winner.winner) + " Won");
            const { showPopup, hidePopup } = createPopup(`<span style='font-size: 40px; font-weight: 500'>${this.getPlayerName(winner.winner).toUpperCase()} WON !!!</span>`);
            showPopup();
            const popup_close = document.querySelector('.popup-container .popup-content .popup-close');
            const popup_container = document.querySelector('.popup-container');
            popup_close.addEventListener('click', ()=>{
                hidePopup();
                this.resetGame();
            });
            popup_container.addEventListener('click', ()=>{
                hidePopup();
                this.resetGame();
            });

            return;
        }
        this.checkGameOver();
        this.boardTiles[i][j].elem.removeEventListener('click', () => { this.makeMove(i, j); });

        this.toggleTurn();
    }
    setupEventListeners() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.boardTiles[i][j].elem.addEventListener('click', () => { this.makeMove(i, j); });
            }

        }
    }

    checkWinner() {
        // check row by row
        for (let i = 0; i < this.size; i++) {
            let winnerFound = true;
            for (let j = 1; j < this.size; j++) {
                if (this.boardTiles[i][j - 1].state !== this.boardTiles[i][j].state || this.boardTiles[i][j].state === 0) {
                    winnerFound = false;
                    break;
                }
            }
            if (winnerFound) {
                return { "winner": this.boardTiles[i][0].state }
            }

        }

        // check column by column
        for (let i = 0; i < this.size; i++) {

            let winnerFound = true;
            for (let j = 1; j < this.size; j++) {
                if (this.boardTiles[j - 1][i].state !== this.boardTiles[j][i].state || this.boardTiles[j][i].state === 0) {
                    winnerFound = false;
                    break;
                }
            }
            if (winnerFound) {
                return { "winner": this.boardTiles[0][i].state }
            }

        }

        // check from upper left corner
        let winnerFound = true;
        for (let i = 1, j = 1; i < this.size && j < this.size; i++, j++) {
            if (this.boardTiles[i - 1][j - 1].state !== this.boardTiles[i][j].state || this.boardTiles[i][j].state === 0) {
                winnerFound = false;
                break;
            }


        }
        if (winnerFound) {
            return { "winner": this.boardTiles[0][0].state }
        }

        // check from upper right corner
        winnerFound = true;
        for (let i = 0, j = this.size - 1; i < this.size && j > 0; i++, j--) {
            if (this.boardTiles[i][j].state !== this.boardTiles[i + 1][j - 1].state || this.boardTiles[i][j].state === 0) {
                winnerFound = false;
                break;
            }
        }

        if (winnerFound) {
            return { "winner": this.boardTiles[this.size - 1][0].state }
        }

        return { "winner": 0 };
    }
}


const board = new Board(3)

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    if (board.player1Name != formData.get('player1')) {
        board.player1Name = formData.get('player1');
    }
    if (board.player2Name != formData.get('player2')) {
        board.player2Name = formData.get('player2');

    }
    if (board.size != formData.get('board_size')) {

        console.log(formData.get('board_size'));
        board.changeSize(formData.get('board_size'));
    }
});