/* Factories: Player */
// Factory for Players
const Player = (playerSign) => {
	this.playerSign = playerSign;

	const getSign = () => {
		return playerSign;
	};

	return { getSign };
};

/* Modules: gameBoard, displayController, gameController */
// Module for gameBoard - Handles game logics
const gameBoard = (() => {
	const gameField = ["", "", "", "", "", "", "", "", ""];

	const setField = (index, player) => {
		gameField[index] = player;
	};

	const getField = () => {
		return gameField;
	};

	const resetField = () => {
		gameField.forEach((_, index) => {
			gameField[index] = "";
		});
	};

	return {
		setField,
		getField,
		resetField,
	};
})();

// Module for displayController - Handles UI event
const displayController = (() => {
	// Add player mark
	const displaySign = (el, playerMark) => {
		el.innerHTML = `<h3 class="player-mark">${playerMark}</h3>`;
	};

	const resetUI = () => {
		document.querySelectorAll(".grid-cell").forEach((cell) => {
			cell.innerHTML = "";
		});
	};

	const changePlayer = (player) => {
		const playerBanner = document.getElementById("current-player");
		if (player === "X") {
			playerBanner.textContent = "Player X's Turn";
		} else {
			playerBanner.textContent = "Player O's Turn";
		}
	};

	const showWinner = () => {
		const modalBG = document.querySelector(".modal-bg");

		modalBG.classList.add("bg-active");

		modalBG.addEventListener("click", () => {
			modalBG.classList.remove("bg-active");
			gameController.resetGame();
		});
	};

	return { displaySign, resetUI, showWinner, changePlayer };
})();

// Module for gameController
const gameController = (() => {
	const playerX = Player("X");
	const playerO = Player("O");
	let currentPlayer = playerX.getSign();

	const gridCells = document.querySelectorAll(".grid-cell");

	const checkWinner = (field) => {
		const winConditions = [
			[field[0], field[1], field[2]], // Vertical
			[field[3], field[4], field[5]],
			[field[6], field[7], field[8]],
			[field[0], field[3], field[6]], // Horizontal
			[field[1], field[4], field[7]],
			[field[2], field[5], field[8]],
			[field[0], field[4], field[8]], // Diagonal
			[field[2], field[4], field[6]],
		];

		// Check if a player satisfies one of win conditions
		winConditions.forEach((condition) => {
			if (
				condition.every((cell) => cell === "X") ||
				condition.every((cell) => cell === "O")
			) {
				displayController.showWinner();
				document.getElementById(
					"win-banner"
				).textContent = `Player ${getCurrentPLayer()} won`;
			}
		});

		// Check is game is a draw
		if (gameBoard.getField().every((cell) => cell === "O" || cell === "X")) {
			displayController.showWinner();
			document.getElementById("win-banner").textContent = "It's a draw!";
		}
	};

	const resetGame = () => {
		gameBoard.resetField();
		currentPlayer = "X";
		document.getElementById("current-player").textContent = "Player X's Turn";
		displayController.resetUI();
	};

	gridCells.forEach((cell, index) => {
		cell.addEventListener("click", (e) => {
			// Check if cell is taken
			if (gameBoard.getField()[index] !== "") {
				return;
			} else {
				// Add sign in gameBoard
				gameBoard.setField(index, getCurrentPLayer());

				// Display sign on UI
				displayController.displaySign(e.target, getCurrentPLayer());

				//Check if game ended
				checkWinner(gameBoard.getField());
				changePlayer();
				displayController.changePlayer(getCurrentPLayer());
			}
		});
	});

	const changePlayer = () => {
		currentPlayer =
			currentPlayer === playerX.getSign()
				? playerO.getSign()
				: playerX.getSign();
	};

	const getCurrentPLayer = () => {
		return currentPlayer;
	};

	document.getElementById("reset-btn").addEventListener("click", () => {
		resetGame();
	});

	return { resetGame };
})();
