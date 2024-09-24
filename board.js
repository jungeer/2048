class Board {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
    }

    addRandomTile() {
        const emptyTiles = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 0) {
                    emptyTiles.push({row, col});
                }
            }
        }
        if (emptyTiles.length > 0) {
            const {row, col} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        let moved = false;
        let score = 0;
        const newGrid = Array(4).fill().map(() => Array(4).fill(0));

        if (direction === 'left' || direction === 'right') {
            for (let row = 0; row < 4; row++) {
                const currentRow = this.grid[row].filter(tile => tile !== 0);
                const mergedRow = this.mergeTiles(currentRow, direction === 'left');
                score += mergedRow.score;
                
                if (direction === 'left') {
                    for (let col = 0; col < mergedRow.tiles.length; col++) {
                        newGrid[row][col] = mergedRow.tiles[col];
                        if (newGrid[row][col] !== this.grid[row][col]) moved = true;
                    }
                } else {
                    for (let col = 3, i = mergedRow.tiles.length - 1; i >= 0; col--, i--) {
                        newGrid[row][col] = mergedRow.tiles[i];
                        if (newGrid[row][col] !== this.grid[row][col]) moved = true;
                    }
                }
            }
        } else {
            for (let col = 0; col < 4; col++) {
                const currentCol = this.grid.map(row => row[col]).filter(tile => tile !== 0);
                const mergedCol = this.mergeTiles(currentCol, direction === 'up');
                score += mergedCol.score;
                
                if (direction === 'up') {
                    for (let row = 0; row < mergedCol.tiles.length; row++) {
                        newGrid[row][col] = mergedCol.tiles[row];
                        if (newGrid[row][col] !== this.grid[row][col]) moved = true;
                    }
                } else {
                    for (let row = 3, i = mergedCol.tiles.length - 1; i >= 0; row--, i--) {
                        newGrid[row][col] = mergedCol.tiles[i];
                        if (newGrid[row][col] !== this.grid[row][col]) moved = true;
                    }
                }
            }
        }

        if (moved) {
            this.grid = newGrid;
        }

        return { moved, score };
    }

    mergeTiles(tiles, forward) {
        const mergedTiles = [];
        let score = 0;

        if (forward) {
            for (let i = 0; i < tiles.length; i++) {
                if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
                    mergedTiles.push(tiles[i] * 2);
                    score += tiles[i] * 2;
                    i++;
                } else {
                    mergedTiles.push(tiles[i]);
                }
            }
        } else {
            for (let i = tiles.length - 1; i >= 0; i--) {
                if (i > 0 && tiles[i] === tiles[i - 1]) {
                    mergedTiles.unshift(tiles[i] * 2);
                    score += tiles[i] * 2;
                    i--;
                } else {
                    mergedTiles.unshift(tiles[i]);
                }
            }
        }

        return { tiles: mergedTiles, score };
    }

    isGameOver() {
        // Check for any empty tiles
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }

        // Check for any possible merges
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const currentTile = this.grid[row][col];
                if (
                    (row < 3 && currentTile === this.grid[row + 1][col]) ||
                    (col < 3 && currentTile === this.grid[row][col + 1])
                ) {
                    return false;
                }
            }
        }

        return true;
    }
}