var numbers = [1,2,3,4,5,6,7,8,9];
var sudokuBoard = [];
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
  createSudokuBoard();
});
