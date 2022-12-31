/*
* Functions used in Sudoku Checker app in index.js
*/

/*Fills a blank length 81 array to represtent the Sudoku board
cell is an object that tracks value, row, and column
*/
const initDataBoard = (board) => {
	
	for (let i = 0; i < 81; i += 1) {
		board.push({
			value: "",
			row: Math.floor(i/9),
			col: i % 9,
		});
	}
	
}

/*Displays a fillable Sudoku board to the DOM*/
const initHTMLBoard = () => {
	
	const board = document.querySelector("#board");
	let square;
	
	for (let i = 0; i < 81; i += 1) {
		
		board.insertAdjacentHTML("beforeend",
		`<input class="cell" id="cell-${i}" maxlength="1" data-index="${i}" data-row="${Math.floor(i/9)}" data-col="${i%9}"></input>`);
		
		square = document.querySelector(`#cell-${i}`);
		square.style.gridColumnStart = i % 9 + 1;
		square.style.gridColumnEnd = i % 9 + 2;
		square.style.gridRowStart = Math.floor(i/9) + 1;
		square.style.gridRowEnd = Math.floor(i/9) + 2;
		
		if (square.dataset.row === "0") {
			square.classList.add("border-top");
		} else if (square.dataset.row === "8") {
			square.classList.add("border-bottom");
		}
		
		if (square.dataset.col === "0") {
			square.classList.add("border-left");
		} else if (square.dataset.col === "8") {
			square.classList.add("border-right");
		}
		
		if (["2", "5"].includes(square.dataset.row)) {
			square.classList.add("border-bottom");
		}
		if (["2", "5"].includes(square.dataset.col)) {
			square.classList.add("border-right");
		}
		
	}
	
};

/*Checks that board only contains characters 1-9*/
const checkValidChars = (board, valid) => {
	const result = {value: true, note: "", errorCell: -1}
	let curCell = {};
	
	for (let i = 0; i < 81; i+=1 ) {
		curCell = board[i];
		if (curCell.value === "") {
			result.value = false;
			result.note = `Empty cell at Row: ${curCell.row+1} Col: ${curCell.col+1}`;
			result.errorCell = i;
			return result;
		} else if (!valid.includes(curCell.value)) {
			result.value = false;
			result.note = `Invalid character entered: ${curCell.value} in Row: ${curCell.row+1} Col: ${curCell.col+1}`;
			result.errorCell = i;
			return result;
		}
	}
	
	return result;
};

/*Checks that rows do not contain duplicate characters*/
const checkRows = (board) => {
	
	const result = {value: true, note: ""}
	let check = [];
	let curCell = {};
	
	for (let row = 0; row < 9; row+= 1) {
		check = [];
		for (let i = 0; i < 9; i += 1) {
			curCell = board[row*9 + i];
			if (check.includes(curCell.value)) {
				result.value = false;
				result.note = `Row ${curCell.row+1} has too many ${curCell.value}s`;
				result.errorCell = row*9 + i;
				return result;
			}
			check.push(curCell.value);
		}
	}
	
	return result;
};

/*Checks that columns do not contian duplicate characters*/
const checkCols = (board) => {
	
	const result = {value: true, note: ""}
	let check = [];
	let curCell = {};
	
	for (let col = 0; col < 9; col += 1) {
		check = [];
		for (let i = 0; i < 9; i += 1) {
			curCell = board[col + i*9];
			if (check.includes(curCell.value)) {
				result.value = false;
				result.note = `Column ${col+1} has too many ${curCell.value}s`;
				result.errorCell = col + i*9;
				return result;
			}
			check.push(curCell.value);
		}
	}
	
	return result;
};

/*Checks that each 3x3 block does not contain duplicate characters*/
const checkBlocks = (board) => {
	
	const result = {value: true, note: ""}
	let check = [];
	let curCell = {};
	let curIndex = 0;
	
	for (let block = 0; block < 9; block += 1) {
		check = [];
		for (let i = 0; i < 9; i += 1) {
			curIndex = Math.floor(block/3)*27 + (block%3)*3 + Math.floor(i/3)*9 + (i%3);
			curCell = board[curIndex];
			if (check.includes(curCell.value)) {
				result.value = false;
				result.note = `Too many ${curCell.value}s in the block at Row: ${curCell.row+1} Col: ${curCell.col+1}`;
				result.errorCell = curIndex;
				return result;
			}
			check.push(curCell.value);
		}
	}
	
	return result;
};

/*Adds text to be displayed after submit*/
const setLabel = (labelText) => {
	
	resultLabel = document.querySelector("#result-label");
	resultLabel.textContent = labelText;
	
}

/*Displays the message on top of the grid in an animated window*/
const showMessage = (clearBoardWrapper, fillSolutionWrapper) => {
	
	const banner = document.querySelector("#message-banner");
	banner.classList.remove("banner-hide");
	banner.classList.add("banner-show");
	
	setTimeout(() => {
		banner.classList.remove("banner-show");
		banner.classList.add("banner-fade");
	}, 2500);
	
	setTimeout(() => {
		
		banner.classList.add("banner-hide");
		banner.classList.remove("banner-fade");
		
		const clearButton = document.querySelector("#clear-button");
		const fillButton = document.querySelector("#fill-button");
		const submitButton = document.querySelector("#submit-button");
		clearButton.addEventListener("click", clearBoardWrapper);
		fillButton.addEventListener("click", fillSolutionWrapper);
		submitButton.disabled = false;
		
	},"3000");
	
}

/*Highlights the cell at which first Sudoku rule was broken in red*/
const highlightError = (cellIndex) => {
	
	const htmlCell = document.querySelector(`#cell-${cellIndex}`);
	const prevErrorCell = document.querySelector(".error-cell");
	
	if (prevErrorCell) {
		prevErrorCell.classList.remove("error-cell");
	}
	
	htmlCell.classList.add("error-cell");
}

/*Removed red highlight from currently highlighted cell*/
const removeHighlightError = () => {
	
	const prevErrorCell = document.querySelector(".error-cell");
	
	if (prevErrorCell) {
		prevErrorCell.classList.remove("error-cell");
	}
	
}

/*Removes previous Sudoku from the board*/
const clearBoard = (board) => {
	
	for (let i = 0; i < 81; i += 1) {
		board[i].value = "";
	}
	
	const cells = document.querySelectorAll(".cell");
	cells.forEach(cell => {
		cell.value = "";
	});
	
	setLabel("");
	removeHighlightError();
	
};

/*Fills a valid Sudoku solution into the board*/
const fillSolution = () => {
	
	const solution = [
	5, 3, 4, 6, 7, 8, 9, 1, 2,
	6, 7, 2, 1, 9, 5, 3, 4, 8,
	1, 9, 8, 3, 4, 2, 5, 6, 7, 
	8, 5, 9, 7, 6, 1, 4, 2, 3, 
	4, 2, 6, 8, 5, 3, 7, 9, 1, 
	7, 1, 3, 9, 2, 4, 8, 5, 6, 
	9, 6, 1, 5, 3, 7, 2, 8, 4, 
	2, 8, 7, 4, 1, 9, 6, 3, 5,
	3, 4, 5, 2, 8, 6, 1, 7, 9
	];
	
	let counter = 0;
	const cells = document.querySelectorAll(".cell");
	cells.forEach(cell => {
		cell.value = solution[counter];
		counter += 1;
	});
	setLabel("");
	removeHighlightError();
	
};

/*Reads user input and checks if solution follows Sudoku rules
writes relevant information to the screen
*/
const checkSolution = (grid, valid, clearBoardWrapper, fillBoardWrapper) => {

	const cells = document.querySelectorAll(".cell");
	cells.forEach(cell => {
		let index = Number.parseInt(cell.dataset.index);
		dataBoard[index].value = cell.value.toString();
	});
	
	let checkResult = checkValidChars(grid, valid);
	if (!checkResult.value) {
		setLabel(checkResult.note);
		showMessage(clearBoardWrapper, fillSolutionWrapper);
		highlightError(checkResult.errorCell);
		return;
	}
	
	checkResult = checkRows(grid);
	if (!checkResult.value) {
		setLabel(checkResult.note);
		showMessage(clearBoardWrapper, fillSolutionWrapper);
		highlightError(checkResult.errorCell);
		return;
	}
	
	checkResult = checkCols(grid);
	if (!checkResult.value) {
		setLabel(checkResult.note);
		showMessage(clearBoardWrapper, fillSolutionWrapper);
		highlightError(checkResult.errorCell);
		return;
	}
	
	checkResult = checkBlocks(grid);
	if (!checkResult.value) {
		setLabel(checkResult.note);
		showMessage(clearBoardWrapper, fillSolutionWrapper);
		highlightError(checkResult.errorCell);
		return;
	}
	
	removeHighlightError();
	setLabel("Solution is valid. Great job!");
	showMessage(clearBoardWrapper, fillSolutionWrapper);
	
};