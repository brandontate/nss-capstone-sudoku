var testNumbers = [];
var sudokuBoard = [];
var win = new Audio('audio/Victory.mp3');
var guesses;
// var myDataRef = new Firebase('https://nss-sudoku.firebaseio.com/puzzle');

function deleteSudokuBoard(){
  $('table').remove();
  createSudokuBoard();
}

function sudokuBoardSize(size) {
  for (i = 0; i < size; i++) {
    sudokuBoard.push([]);
    for (j = 0; j < size; j++) {
      sudokuBoard[i][j] = 0;
    }
  }
  return sudokuBoard;
}

function numberInputArray(size) {
  testNumbers = [];
  for (size; size > 0; size--) {
    testNumbers.push(size);
  }
  return testNumbers;
}


function createSudokuBoard(){
  sudokuBoard = [];
  var size = parseInt($('#board-size').val());
  numberInputArray(size);
  sudokuBoardSize(size);
  var body = document.body;
  var sudokuTable = document.getElementById('sudoku-game-board');
  var tbl  = document.createElement('table');
  var actualSectionID = 0;
  for(var i = 0; i < size; i++){
    var tr = tbl.insertRow();
    for(var j = 0; j < size; j++){
      var td = tr.insertCell();
      var tdInput = td.appendChild(document.createElement('input'));
      tdInput.type = "text";
      tdInput.setAttribute('onkeyup','matrixInsert(this);');
      tdInput.setAttribute('onblur','matrixInsert(this);');
      tdInput.setAttribute('onkeydown','deleteDetector(this);');
      tdInput.setAttribute('maxlength','1');
      tdInput.setAttribute('row','' + i);
      tdInput.setAttribute('column','' + j);
      var rowID = Math.floor(i / Math.sqrt(size));
      var columnID = Math.floor(j / Math.sqrt(size));
      var sectionID = (rowID + columnID) % 2;
      td.setAttribute('section','' + sectionID);
      subSectionCreator(size, i, j, tdInput);
      td.appendChild(document.createTextNode(''));
    }
  }
  sudokuTable.appendChild(tbl);
}

var validateSudoku = function (row, column, value, subsection){
  if (validateRow(row, column, value) === true) {
    if (validateColumn(row, column, value) === true) {
      if (validateSubSection(row, column, value, subsection) === true) {
      return true;
      }
    }
  }
}

function matrixInsert(input){
  guesses = [];
  if (testNumbers.indexOf(parseInt(input.value)) === -1) {
      input.value = "";
      sudokuValidator(input);
  } else {
    sudokuValidator(input);
  }
}

function sudokuValidator(input){
  var guess = parseInt(input.value);
  var row = parseInt(input.getAttribute('row'));
  var column = parseInt(input.getAttribute('column'));
  var subsection = parseInt(input.getAttribute('subsection'));
  guesses.push([row, column, guess, subsection]);
  for (i = 0; i < guesses.length; i++) {
    var guessedRow = guesses[i][0];
    var guessedColumn = guesses[i][1];
    var guessedValue = guesses[i][2];
    var guessedsubsection = guesses[i][3];
    var selectedCell = $('input' + '[row=\"' + guessedRow +'\"]' + '[column=\"' + guessedColumn +'\"]');
    if(guessedValue !== "" && isNaN(guessedValue) !== true){
      if(validateSudoku(guessedRow, guessedColumn, guessedValue, guessedsubsection) === true) {
        sudokuBoard[guessedRow][guessedColumn] = guessedValue;
        selectedCell.removeClass("false-input");
        selectedCell.addClass("valid-input");
        if($('input[solver=yes]').length === 0 && emptyAreas().length === 0 && findInvalidValues() === 0) {
          win.play();
          alert("You have solved the puzzle!");
        }
      } else {
        sudokuBoard[guessedRow][guessedColumn] = guessedValue;
        selectedCell.removeClass("valid-input");
        selectedCell.addClass("false-input");
      }
   }
  }
  if($('.false-input').length !== 0){
    reCheckOldFalseValues();
  }
  emptyCellColor(row, column, input);
}

function emptyCellColor(row, column, input){
  if(sudokuBoard[row][column] === 0 || sudokuBoard[row][column] === "") {
    $(input).removeClass("valid-input");
    $(input).removeClass("false-input");
  }
}

function reCheckOldFalseValues(){
  var value, row, column, subsection, selectedCell;
  for (oldCells = 0; oldCells < $('.false-input').length; oldCells++) {
    value = parseInt($('.false-input')[oldCells].value);
    row = parseInt($('.false-input')[oldCells].getAttribute('row'));
    column = parseInt($('.false-input')[oldCells].getAttribute('column'));
    subsection = parseInt($('.false-input')[oldCells].getAttribute('subsection'));
    selectedCell = $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]');
    if(value !== "" && isNaN(value) !== true){
      if(validateSudoku(row, column, value, subsection) === true) {
        sudokuBoard[row][column] = value;
        selectedCell.removeClass("false-input");
        selectedCell.addClass("valid-input");
      } else {
        sudokuBoard[row][column] = value;
        selectedCell.removeClass("valid-input");
        selectedCell.addClass("false-input");
      }
    }
  }
}

function findInvalidValues(array){
  if ($('.false-input').length !== 0) {
    for (i = 0; i < $('.false-input').length; i++) {
      var guess = parseInt($('.false-input')[i].value);
      var row = parseInt($('.false-input')[i].getAttribute('row'));
      var column = parseInt($('.false-input')[i].getAttribute('column'));
      var subsection = parseInt($('.false-input')[i].getAttribute('subsection'));
      array.push([row, column, guess, subsection]);
      return array;
    }
  } else {
    return $('.false-input').length;
  }
}

function deleteDetector(input) {
  var key = event.keyCode || event.charCode;
  var row = parseInt(input.getAttribute('row'));
  var column = parseInt(input.getAttribute('column'));
  var subsection = parseInt(input.getAttribute('subsection'));
  console.log("key pressed")
  if ( key == 32 && testNumbers.indexOf(input.value) === -1) {
    input.value = "";
  }
  console.log("key pressed")
  if( key == 8 || key == 46 ){
    console.log("backspace pressed")
    sudokuBoard[row][column] = 0;
    $(input).removeClass("valid-input");
    $(input).removeClass("false-input");
  }
}
function findEmptyValues(){
  var emptyCells = 0;
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      if(sudokuBoard[i][j] === 0 || sudokuBoard[i][j] === "") {
        emptyCells++;
      }
    }
  }
  return emptyCells
}

var validateRow = function (row, column, value){
  var rowArray = $('input' + '[row=\"' + row +'\"]');
  for (y = 0; y < rowArray.length; y++) {
    if(parseInt(rowArray[y].getAttribute('column')) !== column) {
      if(value === sudokuBoard[row][y]) {
        return false;
      }
    }
  }
  return true;
}

var validateColumn = function (row, column, value){
  var columnArray = $('input' + '[column=\"' + column +'\"]');
  for (x = 0; x < columnArray.length; x++) {
    if(parseInt(columnArray[x].getAttribute('row')) !== row) {
      if(value === sudokuBoard[x][column]) {
        return false;
      }
    }
  }
  return true;
}

var validateSubSection = function (row, column, value, subsection){
  var subsectionArray = $('input' + '[subsection=\"' + subsection +'\"]');
  for (z = 0; z < subsectionArray.length; z++) {
    var position = [parseInt(subsectionArray[z].getAttribute('row')), parseInt(subsectionArray[z].getAttribute('column'))];
    if(position[0] !== row || position[1] !== column) {
      if(value === sudokuBoard[position[0]][position[1]]) {
        return false;
      }
    }
  }
  return true;
}

function subSectionCreator(size, row, column, cb) {
  switch (size) {
    case 4:
      if (row <= 1 && column <= 1) {
        cb.setAttribute('subsection','1');
      } else if (row <= 1 && column >= 2) {
        cb.setAttribute('subsection','2');
      } else if (row >= 2 && column <= 1) {
        cb.setAttribute('subsection','3');
      } else if (row >= 2 && column >= 2) {
        cb.setAttribute('subsection','4');
      }
      break;
    case 9:
      if (row <= 2 && column <= 2) {
        cb.setAttribute('subsection','1');
      } else if (row <= 2 && column > 2 && column <= 5) {
        cb.setAttribute('subsection','2');
      } else if (row <= 2 && column > 5 && column <= 8) {
        cb.setAttribute('subsection','3');
      } else if (row > 2 && row <= 5 && column <= 2) {
        cb.setAttribute('subsection','4');
      } else if (row > 2 && row <= 5 && column > 2 && column <= 5) {
        cb.setAttribute('subsection','5');
      } else if (row > 2 && row <= 5 && column > 5 && column <= 8) {
        cb.setAttribute('subsection','6');
      } else if (row > 5 && column <= 2) {
        cb.setAttribute('subsection','7');
      } else if (row > 5 && column > 2 && column <= 5) {
        cb.setAttribute('subsection','8');
      } else if (row > 5 && column > 5) {
        cb.setAttribute('subsection','9');
      }
      break;
      default:
    }
}

function emptyAreas(){
  var areas = [];
  for(var i = 0; i < sudokuBoard.length; i++) {
    for(var j = 0; j < sudokuBoard.length; j++) {
      if (sudokuBoard[i][j] === 0) {
        areas.push([i, j]);
      }
    }
  }
  return areas;
}

function solveCurrentCell(row, column, options){
  var $input = $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]')[0]
  var subsection = parseInt($input.getAttribute('subsection'));
  if ($input.value !== ""){
    options.splice(options.indexOf(parseInt($input.value)), 1);
    $input.value = "";
    sudokuBoard[row][column] = 0;
    matrixInsert($input);
  }
  checkPossibleValues(row, column, subsection, options);
  var randomValue = options[Math.floor(Math.random() * options.length)];
  $input.value = randomValue;
  matrixInsert($input);
      if (options.length === 0){
        $input.value = "";
        sudokuBoard[row][column] = 0;
        matrixInsert($input);
        options.splice(options.indexOf(randomValue), 1);
        return false;
      }
  $input.setAttribute('solver','yes');
  return true;
}

function checkPossibleValues(row, column, subsection, array){
  var rowArray = $('input' + '[row=\"' + row +'\"]');
  for (i = 0; i < rowArray.length; i++) {
    if(parseInt(rowArray[i].getAttribute('column')) !== column) {
      if(array.indexOf(parseInt(sudokuBoard[row][i])) !== -1) {
        array.splice(array.indexOf(parseInt(sudokuBoard[row][i])), 1);
      }
    }
  }

  var columnArray = $('input' + '[column=\"' + column +'\"]');
  for (i = 0; i < testNumbers.length; i++) {
    if(parseInt(columnArray[i].getAttribute('row')) !== row) {
      if(array.indexOf(parseInt(sudokuBoard[i][column])) !== -1) {
        array.splice(array.indexOf(parseInt(sudokuBoard[i][column])), 1);
      }
    }
  }

  var subsectionArray = $('input' + '[subsection=\"' + subsection +'\"]');
  for (i = 0; i < subsectionArray.length; i++) {
    var position = [parseInt(subsectionArray[i].getAttribute('row')), parseInt(subsectionArray[i].getAttribute('column'))];
    if(position[0] !== row || position[1] !== column) {
      if(array.indexOf(parseInt(subsectionArray[i].value)) !== -1) {
        array.splice(array.indexOf(parseInt(subsectionArray[i].value)), 1);
      }
    }
  }
  return array;
}

function findLeastAmountOfValid(){
  var position, row, column, $input, subsection, arrayofValidEntries, numbersToPickFrom;
  var areasToTryFirst = [];
  for (z=0; z < emptyAreas().length; z++){
    numbersToPickFrom = testNumbers.slice(0);
    position = emptyAreas()[z];
    row = position[0];
    column = position[1];
    $input = $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]')[0]
    subsection = parseInt($input.getAttribute('subsection'));
    arrayofValidEntries = checkPossibleValues(row, column, subsection, numbersToPickFrom);
    areasToTryFirst.push({ "row": row, "column": column, "valid": arrayofValidEntries });
  }
  return areasToTryFirst;
}

function sudokuSolver(){
  var position, row, column, $input, quadrant, arrayofValidEntries, validOptions,
  numbersToPickFrom, cellsToTry, previousRow, previousColumn, previousQuadrant;
  var areasToTryFirst = [];
  var previousCell = [];
  var previousValue = 0;
  var clearBoard = 0;
  do {
    cellsToTry = 0;
    cellsToTry = findLeastAmountOfValid();
    currentCell = findShortValid(cellsToTry);
    if(currentCell.valid.length !== 0){
      row = currentCell.row;
      column = currentCell.column;
      validOptions = currentCell.valid;
      if(previousValue !== 0){
        validOptions.splice(validOptions.indexOf(previousValue), 1);
      }
      if(validOptions.length !== 0){
        solveCurrentCell(row, column, validOptions);
        previousCell.push(currentCell);
      } else {
        do {
          previousRow = previousCell[previousCell.length-1].row;
          previousColumn = previousCell[previousCell.length-1].column;
          $input = $('input' + '[row=\"' + previousRow +'\"]' + '[column=\"' + previousColumn +'\"]')[0];
          previousQuadrant = $input.getAttribute('quadrant');
          previousValue = parseInt($input.value);
          $input.value = "";
          sudokuBoard[previousRow][previousColumn] = 0;
          emptyCellColor(previousRow, previousColumn, $input);
          previousCell.splice((previousCell.length - 1), 1);
          clearBoard++;
          if (clearBoard === 15) {
            do {
              var numberOfSolved = $('input[solver=yes]');
              numberOfSolved[numberOfSolved.length - 1].value = "";
              var rowToDelete = numberOfSolved[numberOfSolved.length - 1].getAttribute('row');
              var columnToDelete = numberOfSolved[numberOfSolved.length - 1].getAttribute('column');
              sudokuBoard[rowToDelete][columnToDelete] = 0;
              numberOfSolved[numberOfSolved.length - 1].removeAttribute('solver');
              emptyCellColor(rowToDelete, columnToDelete, numberOfSolved[numberOfSolved.length - 1]);
              numberOfSolved.splice((numberOfSolved.length - 1),1);
            }
            while (numberOfSolved.length !== 0);
            clearBoard = 0;
            previousValue = 0;
            previousCell = [];
          }
        } while (currentCell.valid.length !== 0);
      }
    } else {
      do {
        previousRow = previousCell[previousCell.length-1].row;
        previousColumn = previousCell[previousCell.length-1].column;
        $input = $('input' + '[row=\"' + previousRow +'\"]' + '[column=\"' + previousColumn +'\"]')[0];
        previousQuadrant = $input.getAttribute('quadrant');
        previousValue = parseInt($input.value);
        $input.value = "";
        sudokuBoard[previousRow][previousColumn] = 0;
        emptyCellColor(previousRow, previousColumn, $input);
        previousCell.splice((previousCell.length - 1), 1);
        clearBoard++;
        if (clearBoard === 15) {
          do {
            var numberOfSolved = $('input[solver=yes]');
            numberOfSolved[numberOfSolved.length - 1].value = "";
            var rowToDelete = numberOfSolved[numberOfSolved.length - 1].getAttribute('row');
            var columnToDelete = numberOfSolved[numberOfSolved.length - 1].getAttribute('column');
            sudokuBoard[rowToDelete][columnToDelete] = 0;
            numberOfSolved[numberOfSolved.length - 1].removeAttribute('solver');
            emptyCellColor(rowToDelete, columnToDelete, numberOfSolved[numberOfSolved.length - 1]);
            numberOfSolved.splice((numberOfSolved.length - 1),1);
          }
          while (numberOfSolved.length !== 0);
          clearBoard = 0;
          previousValue = 0;
          previousCell = [];
        }
      }
      while (currentCell.valid.length !== 0);
    }
  } while (emptyAreas().length !== 0);
}

function findShortValid(array){
  var current, smallest, noValidOptions;
  for(oneValid = 0; oneValid < array.length; oneValid++){
    current = array[oneValid];
    if(current.valid.length !== 0){
      if(smallest === undefined){
        smallest = current;
      } else if (current.valid.length < smallest.valid.length){
        smallest = current;
      }
    } else {
      noValidOptions = current;
    }
  }
  if(smallest !== undefined){
    return smallest;
  } else {
    return noValidOptions;
  }

}

function checkDifficulty(){
  var difficulty = $('#difficulty').val();
  var size = parseInt($('#board-size').val());
  var startingNumbers;
  if (size === 9){
  switch (difficulty){
    case "easy":
      startingNumbers = 40;
      break;

    case "medium":
      startingNumbers = 33;
      break;

    case "hard":
      startingNumbers = 29;
      break;
    }
  } else if (size === 4){
    switch (difficulty){
      case "easy":
      startingNumbers = 7;
      break;

      case "medium":
      startingNumbers = 6;
      break;

      case "hard":
      startingNumbers = 4;
      break;
    }
  }
  return startingNumbers;
}

function insertBoard(startingNumbers){
  var row, column, value, $input, insertValue, testAnswers;
  var counter = 0;
  var size = parseInt($('#board-size').val());
  sudokuSolver();
  testAnswers = sudokuBoard;
  deleteSudokuBoard();
  do{
    row = Math.floor(Math.random() * (size-1));
    column = Math.floor(Math.random() * (size-1));
     $input = $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]')[0];
    if($input.value === ""){
      $input.value = testAnswers[row][column];
      matrixInsert($input);
      $input.setAttribute('disabled','disabled');
      $input.setAttribute('startingNumber','yes');
      counter++;
    }
  }
  while(counter !== startingNumbers);
  testAnswers
}

function createNewGame(){
  deleteSudokuBoard();
  insertBoard(checkDifficulty());
}

function findUserInput(){
  var guessed = [];
  for (var x = 0; x < sudokuBoard.length; x++){
    for (var y = 0; y < sudokuBoard.length; y++){
      var $input;
      $input = $('input' + '[row=\"' + x +'\"]' + '[column=\"' + y +'\"]')[0];
      if($input.getAttribute('startingNumber') !== 'yes'){
        if($input.value !== ""){
          guessed.push([x, y, parseInt($input.value)]);
          $input.value = 0;
          sudokuBoard[x][y] = 0;
          emptyCellColor(x, y, $input);
        }
      }
    }
  }
  return guessed;
}

function checkUserInputWithValid(){
  var userInput = findUserInput();
  sudokuSolver();
  debugger;
  var userInputCounter, userInputRow, userInputColumn, userInputValue;
  for (var x = 0; x < sudokuBoard.length; x++){
    for (var y = 0; y < sudokuBoard.length; y++){
      var $input;
      $input = $('input' + '[row=\"' + x +'\"]' + '[column=\"' + y +'\"]')[0];
      if($input.getAttribute('solver') === 'yes'){
        userInputCounter = 0;
        do{
          userInputRow = userInput[userInputCounter][0];
          userInputColumn = userInput[userInputCounter][1];
          userInputValue = userInput[userInputCounter][2];
          if(x === userInputRow && y === userInputColumn){
            if(userInputValue === parseInt($input.value)){
              $input.removeAttribute('solver');
            } else {
              $input.removeAttribute('solver')
              $input.setAttribute('corrected','yes');
            }
          }
          userInputCounter++;
        }
        while(userInputCounter !== userInput.length);
      }
    }
  }
}

$(document).ready(function(){
  createSudokuBoard();
  insertBoard(checkDifficulty());
});
