//==============================================================================
//Cell class
//==============================================================================
function Cell(row, col) {
  this.row = row;
  this.col = col;
  this.status = "dead";
}

//Updates status of cell
Cell.prototype.setStatus = function(newStatus) {
  this.status = newStatus;
};

//==============================================================================
//Grid class
//==============================================================================
function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.board = this._constructBoard();
}

//Constructs multidimensional array and fills it with dead cells
Grid.prototype._constructBoard = function() {
  var board = new Array(this.height);
  for (var row = 0; row < this.height; row++) {
    board[row] = new Array(this.width);
    for (var col = 0; col < this.width; col++) {
      board[row][col] = new Cell(row, col);
    }
  }
  return board;
};

//Returns true if row, col are in range of the board
Grid.prototype._isInRange = function(row, col) {
  return row >= 0 && row <= this.height - 1 &&
    col >= 0 && col <= this.width - 1;
};

//Gets number of cell's living neighbors
Grid.prototype._getNumNeighbors = function(cell) {
  var numOfNeighbors = 0,
    row = cell.row,
    col = cell.col,
    width = this.width,
    height = this.height,
    board = this.board;

  if (this._isInRange(row - 1, col - 1, width, height) &&
    board[row - 1][col - 1].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row - 1, col, width, height) &&
    board[row - 1][col].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row - 1, col + 1, width, height) &&
    board[row - 1][col + 1].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row, col - 1, width, height) &&
    board[row][col - 1].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row, col + 1, width, height) &&
    board[row][col + 1].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row + 1, col - 1, width, height) &&
    board[row + 1][col - 1].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row + 1, col, width, height) &&
    board[row + 1][col].status === 'alive') {
    numOfNeighbors++;
  }
  if (this._isInRange(row + 1, col + 1, width, height) &&
    board[row + 1][col + 1].status === 'alive') {
    numOfNeighbors++;
  }
  return numOfNeighbors;
};

//Transforms board to its next generation and returns it
Grid.prototype.nextGen = function() {
  var toBeBorn = [],
    toKill = [],
    row, col, i;

  for (row = 0; row < this.height; row++) {
    for (col = 0; col < this.width; col++) {
      var cell = this.board[row][col];
      var numNeighbors = this._getNumNeighbors(cell);

      if (cell.status === 'alive') {

        /* Any live cell with fewer than two live neighbours dies, 
        as if caused by under-population. */
        if (numNeighbors < 2) {
          toKill.push(cell);
        }

        /* Any live cell with two or three live neighbours lives on 
        to the next generation (do nothing) */

        /* Any live cell with more than three live neighbours dies, 
        as if by over-population */
        if (numNeighbors > 3) {
          toKill.push(cell);
        }

      } else {
        /* Any dead cell with exactly three live neighbours becomes a live 
        cell, as if by reproduction. */
        if (numNeighbors === 3) {
          toBeBorn.push(cell);
        }
      }
    }
  }
  for (i = 0; i < toBeBorn.length; i++) {
    toBeBorn[i].setStatus("alive");
  }
  for (i = 0; i < toKill.length; i++) {
    toKill[i].setStatus("dead");
  }
  return this.board;
};

//Kills all cells on board
Grid.prototype.clearBoard = function() {
  for (var row = 0; row < this.height; row++) {
    for (var col = 0; col < this.width; col++) {
      this.board[row][col].status = "dead";
    }
  }
  return this.board;
};

//Generates random board, with 30% of cells living
Grid.prototype.randomBoard = function() {
  for (var row = 0; row < this.height; row++) {
    for (var col = 0; col < this.width; col++) {
      this.board[row][col].status = "dead";
      if (Math.random() >= 0.7) {
        this.board[row][col].status = "alive";
      }
    }
  }
  return this.board;
};

var LifeBoard = new Grid(100, 60);
LifeBoard.randomBoard();

module.exports = LifeBoard;