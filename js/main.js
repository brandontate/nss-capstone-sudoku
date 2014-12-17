var numbers = [1,2,3,4,5,6,7,8,9];
var sudokuBoard = [];

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
        td.appendChild(document.createTextNode(''));
      }
    }
  body.appendChild(tbl);
}

$(document).ready(function(){
  createSudokuBoard();
});
