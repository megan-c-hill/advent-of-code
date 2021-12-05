import fs from "fs";

const FILE_NAME = './Day4/day4.txt';

const readBingoTextFile = () => {
    const stringArray = fs.readFileSync(FILE_NAME, 'utf8').split('\n\n');

    const numbersCalled = stringArray.shift().split(',');

    const boards = stringArray.map((board) => {
        const boardRows = board.split('\n');

        return boardRows.map((row) =>
            row.split(' ').reduce((accum, item) => {
                if (item !== '') {
                    accum.push({
                        value: Number(item),
                        checked: false
                    })
                }
                return accum
            }, [])
        )
    });

    return {
        numbersCalled,
        boards
    };
};

const checkRowForBingo = (board) => {
    let isBingo = false
    board.forEach((row) => {
        const bingoInRow = row.every((element) => {
            return element.checked
        });

        if (bingoInRow) isBingo = true;
    });

    return isBingo;
}

const checkColumnsForBingo = (board) => {
    let isBingo = false;
    for (let i = 0; i < 5; i++) {
        let count = 0;
        for (let j = 0; j < 5; j++) {
            board[j][i].checked ? count++ : null;
        }

        if (count === 5) isBingo = true;
    }

    return isBingo;
}

const checkForBingo = (board) => {
    const bingosInRow = checkRowForBingo(board);
    const bingosInColumn = checkColumnsForBingo(board);

    return bingosInRow || bingosInColumn;
};

const numberOfBingos = (boards) =>
    boards.filter((board) => checkForBingo(board)).length;

const checkForBingoOnAllBoards = (boards) =>
    numberOfBingos(boards) > 0;

const calculateBingoCount = (boardToCount) => {
    let count = 0;

    boardToCount.forEach((row) => {
        row.forEach((element) => {
            if (!element.checked) {
                count += element.value
            }
        })
    })

    return count;
}

const checkNumberOnBoards = (number, boards) => {
    boards.forEach((board) => {
        board.forEach((row) => {
            row.forEach((element) => {
                if (element.value === number) {
                    element.checked = true;
                }
            })
        })
    })
};

const playBingo = () => {
    const numbersAndBoards = readBingoTextFile();

    let index = 0;
    while (!checkForBingoOnAllBoards(numbersAndBoards.boards)) {
        checkNumberOnBoards(Number(numbersAndBoards.numbersCalled[index]), numbersAndBoards.boards);
        index++;
    }

    const numberThatGotBingo = numbersAndBoards.numbersCalled[index - 1];
    const winningBoard = numbersAndBoards.boards.find((board) => checkForBingo(board));
    const calculatedBingoCount = calculateBingoCount(winningBoard);

    const part1Answer = numberThatGotBingo * calculatedBingoCount;
    console.log('part1Answer', part1Answer);
}

const calculateScoreForLosingBoard = () => {
    const numbersAndBoards = readBingoTextFile();

    let index = 0;
    while (numberOfBingos(numbersAndBoards.boards) < numbersAndBoards.boards.length - 1) {
        checkNumberOnBoards(Number(numbersAndBoards.numbersCalled[index]), numbersAndBoards.boards);
        index++;
    }

    const lastBoard = numbersAndBoards.boards.find((board) => !checkForBingo(board));

    while (numberOfBingos(numbersAndBoards.boards) < numbersAndBoards.boards.length) {
        checkNumberOnBoards(Number(numbersAndBoards.numbersCalled[index]), numbersAndBoards.boards);
        index++;
    }

    const numberThatGotBingo = numbersAndBoards.numbersCalled[index - 1];
    const calculatedBingoCount = calculateBingoCount(lastBoard);

    const part2Answer = numberThatGotBingo * calculatedBingoCount;
    console.log('part2Answer', part2Answer);

}

playBingo();
calculateScoreForLosingBoard();