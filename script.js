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
        this.setupEventListeners();
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
        if (elemName == 'x') {
            elem.classList.add('x');
        } else {
            elem.classList.add('o')
        }

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
    }

    setupEventListeners() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.boardTiles[i][j].elem.addEventListener('click', () => {
                    if (this.boardTiles[i][j].state != 0) return;
                    this.boardTiles[i][j].state = this.currentPlayer;
                    this.boardTiles[i][j].elem.appendChild(this.currentPlayer == 1 ? this.createMarker('x') : this.createMarker('o'));
                    this.toggleTurn();
                });
            }

        }
    }
}

const temp = new Board(4);