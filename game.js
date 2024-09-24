class Game {
    constructor() {
        this.board = new Board();
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.isOver = false;
        this.history = [];
        this.setupNewGameButton();
        this.setupUndoButton();
        this.setupKeyboardControls();
        this.setupMouseControls(); // 新增
    }

    start() {
        this.board.addRandomTile();
        this.board.addRandomTile();
        this.updateView();
    }

    move(direction) {
        if (this.isOver) return;

        this.saveState();
        const moveResult = this.board.move(direction);
        if (moveResult.moved) {
            this.score += moveResult.score;
            this.updateBestScore();
            this.board.addRandomTile();
            this.updateView();
            
            if (this.board.isGameOver()) {
                this.isOver = true;
                alert('Game Over! Your score: ' + this.score);
            }
        }
    }

    updateView() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const value = this.board.grid[row][col];
                const tile = document.createElement('div');
                tile.className = `tile ${value ? 'tile-' + value : ''}`;
                tile.textContent = value || '';
                gameBoard.appendChild(tile);
            }
        }

        document.querySelector('#score span').textContent = this.score;
        document.querySelector('#best-score span').textContent = this.bestScore;
    }

    setupNewGameButton() {
        const newGameButton = document.getElementById('new-game');
        newGameButton.addEventListener('click', () => {
            this.board = new Board();
            this.score = 0;
            this.isOver = false;
            this.history = [];
            this.start();
        });
    }

    setupUndoButton() {
        const undoButton = document.getElementById('undo');
        undoButton.addEventListener('click', () => {
            if (this.history.length > 0) {
                const previousState = this.history.pop();
                this.board.grid = previousState.grid;
                this.score = previousState.score;
                this.isOver = false;
                this.updateView();
            }
        });
    }

    saveState() {
        this.history.push({
            grid: this.board.grid.map(row => [...row]),
            score: this.score
        });
    }

    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
    }

    loadBestScore() {
        return parseInt(localStorage.getItem('bestScore')) || 0;
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': this.move('up'); break;
                case 'ArrowDown': this.move('down'); break;
                case 'ArrowLeft': this.move('left'); break;
                case 'ArrowRight': this.move('right'); break;
            }
        });
    }

    setupMouseControls() {
        const gameBoard = document.getElementById('game-board');
        let startX, startY, endX, endY;
        let isDragging = false;

        gameBoard.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            isDragging = true;
        });

        gameBoard.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            endX = e.clientX;
            endY = e.clientY;
        });

        gameBoard.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            this.handleSwipe(startX, startY, endX, endY);
        });

        // 添加触摸事件支持
        gameBoard.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault(); // 防止页面滚动
        });

        gameBoard.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
            e.preventDefault(); // 防止页面滚动
        });

        gameBoard.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
            e.preventDefault(); // 防止页面滚动
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const dx = endX - startX;
        const dy = endY - startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) { // 设置一个最小滑动距离
            if (absDx > absDy) {
                // 水平滑动
                this.move(dx > 0 ? 'right' : 'left');
            } else {
                // 垂直滑动
                this.move(dy > 0 ? 'down' : 'up');
            }
        }
    }
}

// Start the game
const game = new Game();
game.start();