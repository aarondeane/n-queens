// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // Take in a row index from the board which should be an array
      // Create a counter to check for number of 1's in row
      
      var counter = 0;
      // Iterate through this array at rowIndex
      for (var i = 0; i < rowIndex.length; i++) {
        // Check to see if value at index === 1
        if (rowIndex[i] === 1) {
          // If value is equal to 1 counter ++
          counter++;
        }
      }
      // Return the boolean value of counter === 2      
      return (counter >= 2);     
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // Take in an n x n matrix
      var currRows = this.rows();
      var rowConflict = false;
      // iterate through the matrix rows
      for (var i = 0; i < currRows.length; i++) {
        // For each row, determine whether that row has a conflict
        if (this.hasRowConflictAt(currRows[i])) {
          // Return the result
          return true;
        }      
      }
      return rowConflict;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //debugger;
      var columnCnt = this.rows()[0].length;
      var rowCnt = columnCnt;
      var counter = 0;
      // Iterate over all of the rows
      for (var i = 0; i < rowCnt; i++) {
        if (this.rows()[i][colIndex] === 1) {
          counter++;
        }
        // Check the value at colIndex
      }
      return (counter >= 2);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      
      var columns = this.rows()[0].length;
      var colConflict = false;
      
      for (var i = 0; i < columns; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      
      return colConflict;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var colIndex = majorDiagonalColumnIndexAtFirstRow;
      var matrix = this.rows();
      var columnCnt = this.rows()[0].length;
      var counter = 0;
      //debugger;
      for (var i = colIndex, j = 0; j < columnCnt; i++, j++) {
        if (i >= 0 && i < columnCnt) {
          if (matrix[i][j] === 1) {
            counter++;
          }    
        }
      }
      return counter >= 2; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var result = false;
      var rows = this.rows();
      var cnt = this.rows().length - 1;
      //debugger;
      for (var i = cnt; i > 0; i--) {
        
        if (this.hasMajorDiagonalConflictAt(0 - i)) {
          result = true;
        }
      }
      //debugger;
      for (var i = 0; i < cnt; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          result = true;
        }
      }
      
      return result;      
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
