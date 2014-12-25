var sudokuBoard = [];
var testNumbers = [];
var insertBoard = [
[5, 3, 4, 6, 7, 8, 9, 1, 2],
[6, 7, 2, 1, 9, 5, 3, 4, 8],
[1, 9, 8, 3, 4, 2, 5, 6, 7],
[8, 5, 9, 7, 6, 1, 4, 2, 3],
[4, 2, 6, 8, 5, 3, 7, 9, 1],
[7, 1, 3, 9, 2, 4, 8, 5, 6],
[9, 6, 1, 5, 3, 7, 2, 8, 4],
[2, 8, 7, 4, 1, 9, 6, 3, 5],
[3, 4, 5, 2, 8, 6, 1, 7, 9]
]
var smallSudokuBoard = [];
var win = new Audio('audio/Victory.mp3');

function deleteSudokuBoard(){
  $('table').remove();
  createSmallSudokuBoard();
}

function sudokuBoardCreator(size) {
  for (i = 0; i < size; i++) {
    smallSudokuBoard.push([]);
    for (j = 0; j < size; j++) {
      smallSudokuBoard[i][j] = 0;
    }
  }
  return smallSudokuBoard;
}

function numberInputArray(size) {
  testNumbers = [];
  for (size; size > 0; size--) {
    testNumbers.push(size);
  }
  return testNumbers;
}


function createSmallSudokuBoard(){
  smallSudokuBoard = [];
  var size = parseInt($('#board-size').val());
  numberInputArray(size);
  sudokuBoardCreator(size);
  var body = document.body;
  var sudokuTable = document.getElementById('sudoku-game-board');
  var tbl  = document.createElement('table');
  //tbl.setAttribute('onkeypress','validateSmallSudoku();');
  var actualSectionID = 0;
  for(var i = 0; i < size; i++){
    var tr = tbl.insertRow();
    for(var j = 0; j < size; j++){
      var td = tr.insertCell();
      var tdInput = td.appendChild(document.createElement('input'));
      tdInput.setAttribute('onkeyup','smallMatrixInsert(this);');
      tdInput.setAttribute('onkeydown','deleteDetector(this);');
      tdInput.setAttribute('maxlength','1');
      tdInput.setAttribute('row','' + i);
      tdInput.setAttribute('column','' + j);
      debugger;
      var rowID = Math.floor(i / Math.sqrt(size));
      var columnID = Math.floor(j / Math.sqrt(size));
      var sectionID = (rowID + columnID) % 2;
      tdInput.setAttribute('section','' + sectionID);
      subSectionCreator(size, i, j, tdInput);
      td.appendChild(document.createTextNode(''));
    }
  }
  sudokuTable.appendChild(tbl);
  colorSection();
}

function reCalculateFalseInput(input) {
  var falseValues = $(".false-input");
  for (i = 0; i < falseValues.length; i++) {
    debugger;
    var guess = parseInt(falseValues[i].value);
    var row = falseValues[i].getAttribute('row');
    var column = falseValues[i].getAttribute('column');
    var quadrant = falseValues[i].getAttribute('quadrant');
    if (input.value !== "") {
      if (validateSmallSudoku(row, column, guess, quadrant) === false) {
        smallSudokuBoard[row][column] = guess
        $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]').removeClass("false-input");
        $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]').addClass("valid-input");
        if (validateSmallSudoku(row, column, guess, quadrant) === true) {
          smallSudokuBoard[row][column] = guess;
          $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]').removeClass("false-input");
          $('input' + '[row=\"' + row +'\"]' + '[column=\"' + column +'\"]').addClass("valid-input");
          if(findEmptyValues() === 0 && findInvalidValues() === 0) {
            win.play();
            alert("You have solved the puzzle!");
          }
        }
      }
    }
  }
}

var validateSmallSudoku = function (row, column, value, quadrant){
  if (validateRow(row, column, value) === true) {
    if (validateColumn(row, column, value) === true) {
      if (validateSubSection(row, column, value, quadrant) === true) {
      return true;
      }
    }
  }
}

function smallMatrixInsert(input){
  var guess = parseInt(input.value);
  var row = input.getAttribute('row');
  var column = input.getAttribute('column');
  var quadrant = input.getAttribute('quadrant');
  if (testNumbers.indexOf(guess) === -1) {
    input.value = "";
  } else if (input.value === "") {
    smallSudokuBoard[row][column] = 0;
  } else if (guess === smallSudokuBoard[row][column]) {
    smallSudokuBoard[row][column] = guess
  } else {
    debugger;
      if(validateSmallSudoku(row, column, guess, quadrant) === true) {
          smallSudokuBoard[row][column] = guess;
          $(input).removeClass("false-input");
          $(input).addClass("valid-input");
          if(findEmptyValues() === 0 && findInvalidValues() === 0) {
            win.play();
            alert("You have solved the puzzle!");
          }
        } else {
          smallSudokuBoard[row][column] = guess
          $(input).removeClass("valid-input");
          $(input).addClass("false-input");
        }
    }
  emptyCellColor(row, column, input);
  findEmptyValues();
  findInvalidValues();
  reCalculateFalseInput(input);
}


function emptyCellColor(row, column, input){
  if(smallSudokuBoard[row][column] === 0 || smallSudokuBoard[row][column] === "") {
    $(input).removeClass("valid-input");
    $(input).removeClass("false-input");
  }
}

function findInvalidValues(){
  return $('.false-input').length;
}

function deleteDetector(input) {
  var key = event.keyCode || event.charCode;
  var row = input.getAttribute('row');
  var column = input.getAttribute('column');
  console.log("key pressed")
  if ( key == 32 && testNumbers.indexOf(input.value) === -1) {
    input.value = "";
  }
  console.log("key pressed")
  if( key == 8 || key == 46 ){
    console.log("backspace pressed")
    smallSudokuBoard[row][column] = 0;
    $(input).removeClass("valid-input");
    $(input).removeClass("false-input");
  }
}

function findEmptyValues(){
  var emptyCells = 0;
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      if(smallSudokuBoard[i][j] === 0 || smallSudokuBoard[i][j] === "") {
        emptyCells++;
      }
    }
  }
  return emptyCells
}

var validateRow = function (row, column, value){
  var position = [row, column];
  for (column = 0; column < testNumbers.length; column++) {
    if(position !== [row, column]) {
      if(value === smallSudokuBoard[row][column]) {
        return false;
      }
    }
  }
  return true;
}

var validateColumn = function (row, column, value){
  var position = [row, column];
  for (row = 0; row < testNumbers.length; row++) {
    if(position !== [row, column]) {
      if(value === smallSudokuBoard[row][column]) {
        return false;
      }
    }
  }
  return true;
}

var validateSubSection = function (row, column, value, quadrant){
  var position = [row, column];
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      var a = '[row=\"' + i +'\"]';
      var b = '[column=\"' + j +'\"]';
      var c = '[quadrant=\"' + quadrant +'\"]';
      if (position !== [i, j]) {
        var inputSelected = $('input' + a + b + c);
        if (inputSelected.length === 1){
          if (value === smallSudokuBoard[i][j]) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

function subSectionCreator(size, row, column, cb) {
  switch (size) {
    case 4:
      if (row <= 1 && column <= 1) {
        cb.setAttribute('quadrant','1');
      } else if (row <= 1 && column >= 2) {
        cb.setAttribute('quadrant','2');
      } else if (row >= 2 && column <= 1) {
        cb.setAttribute('quadrant','3');
      } else if (row >= 2 && column >= 2) {
        cb.setAttribute('quadrant','4');
      }
      break;
    case 9:
      if (row <= 2 && column <= 2) {
        cb.setAttribute('quadrant','1');
      } else if (row <= 2 && column > 2 && column <= 5) {
        cb.setAttribute('quadrant','2');
      } else if (row <= 2 && column > 5 && column <= 8) {
        cb.setAttribute('quadrant','3');
      } else if (row > 2 && row <= 5 && column <= 2) {
        cb.setAttribute('quadrant','4');
      } else if (row > 2 && row <= 5 && column > 2 && column <= 5) {
        cb.setAttribute('quadrant','5');
      } else if (row > 2 && row <= 5 && column > 5 && column <= 8) {
        cb.setAttribute('quadrant','6');
      } else if (row > 5 && row <= 8 && column > 2) {
        cb.setAttribute('quadrant','7');
      } else if (row > 5 && row <= 8 && column > 2 && column <= 5) {
        cb.setAttribute('quadrant','8');
      } else if (row > 5 && row <= 8 && column > 2 && column <= 5) {
        cb.setAttribute('quadrant','9');
      }
      break;
      default:
    }
}



function colorSection(){
  if ($('input[section="0"]')) {
    $('input[section="0"]').addClass('even-section');
  }
  if ($('input[section="1"]')){
    $('input[section="1"]').addClass('odd-section');
  }
}




function randomSelection(){
  var numbersClone = numbers.slice(0);
  var counter = numbersClone.length;
  var newNumbers = [];
  while(counter > 0) {
    var index = Math.floor(Math.random() * counter);
    newNumbers.push(numbersClone.splice(index, 1));
    counter--;
    alert(newNumbers);
  }
}

function insertTest(){
  for(var i = 0; i < 9; i++){
    var row = '[row=\"' + i +'\"]'
      for(var j = 0; j < 9; j++){
        var column = '[column=\"' + j +'\"]'
        $('input' + row + column).val(insertBoard[i][j])
      }
  }
}

function createSudokuBoard(){
  var body = document.body;
  var tbl  = document.createElement('table');
  var actualSectionID = 0;
  for(var i = 0; i < 9; i++){
    var tr = tbl.insertRow();
    for(var j = 0; j < 9; j++){
        var td = tr.insertCell();
        var tdInput = td.appendChild(document.createElement('input'));
        tdInput;
        tdInput.setAttribute('maxlength','1');
        tdInput.setAttribute('row','' + i);
        tdInput.setAttribute('column','' + j);
        var rowID = Math.floor(i / 3);
        var columnID = Math.floor(j / 3);
        var sectionID = (rowID + columnID) % 2;
        tdInput.setAttribute('section','' + sectionID);
        td.appendChild(document.createTextNode(''));
      }
    }
  body.appendChild(tbl);
  colorSection();
}

function colorSection(){
  if ($('input[section="0"]')) {
    $('input[section="0"]').addClass('even-section');
  }
  if ($('input[section="1"]')){
    $('input[section="1"]').addClass('odd-section');
  }
}


$(document).ready(function(){
  createSmallSudokuBoard();
});
