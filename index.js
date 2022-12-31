/*
*Sudoku Checker takes a Sudoku as input and outputs a message telling the userAgent
*if the input Sudoku is valid, along with relevant information when the Sudoku
*is not valid
*/

const dataBoard = []; //board representation
const validChars = [...Array(9).keys()].map(character => (character + 1).toString()); //chars 1-9

/*Set up board*/

initDataBoard(dataBoard);
initHTMLBoard();

/*Add button functionality*/

const clearButton = document.querySelector("#clear-button");
const fillButton = document.querySelector("#fill-button");
const submitButton = document.querySelector("#submit-button");

const clearBoardWrapper = () => {
	clearBoard(dataBoard);
};

const fillSolutionWrapper = () => {
	fillSolution();
};

const checkSolutionWrapper = () => {
	
	submitButton.disabled = true;
	clearButton.removeEventListener("click", clearBoardWrapper);
	fillButton.removeEventListener("click", fillSolutionWrapper);
	
	checkSolution(dataBoard, validChars, clearBoardWrapper, fillSolutionWrapper);
	
};

clearButton.addEventListener("click", clearBoardWrapper);

fillButton.addEventListener("click", fillSolutionWrapper);

submitButton.addEventListener("click", checkSolutionWrapper);