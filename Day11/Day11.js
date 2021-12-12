import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day11/Day11.txt';

const getStartingGrid = () => {
    const rows = readDataIntoArray(FILE_NAME, false, '\n');

    return rows.map((row) => row.split('').map((digit) => ({
        value: Number(digit),
        hasFlashed: false
    })));
}

const mapThroughGrid = (grid, func) =>
    grid.map((row) =>
        row.map((spot) => func(spot))
    );

const findFlashPoint = (grid) => {
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
        for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
            const spot = grid[rowIndex][colIndex];
            if (spot.value > 9 && !spot.hasFlashed) {
                return {
                    rowIndex,
                    colIndex
                }
            }
        }
    }

    return null;
}

const handleFlash = (grid) => {
    const {rowIndex, colIndex} = findFlashPoint(grid);
    grid[rowIndex][colIndex].hasFlashed = true;

    for (let adjacentRowIndex = rowIndex - 1; adjacentRowIndex <= rowIndex + 1; adjacentRowIndex++) {
        for (let adjacentColIndex = colIndex - 1; adjacentColIndex <= colIndex + 1; adjacentColIndex++) {
            if (adjacentRowIndex >= 0 && adjacentColIndex >= 0 && adjacentRowIndex < grid.length && adjacentColIndex < grid[0].length) {
                //Note this does include the center slot, but it'll already be high enough so that's fine
                grid[adjacentRowIndex][adjacentColIndex].value = grid[adjacentRowIndex][adjacentColIndex].value + 1
            }
        }
    }

    return grid;
}

const makeMove = (grid) => {
    let flashes = 0;

    let updatedGrid = mapThroughGrid(grid, (spot) => ({
        value: spot.value += 1,
        hasFlashed: spot.hasFlashed
    }));

    while (findFlashPoint(updatedGrid)) {
        flashes++;
        updatedGrid = handleFlash(updatedGrid);
    }

    updatedGrid = mapThroughGrid(updatedGrid, (spot) => ({
        value: spot.value > 9 ? 0 : spot.value,
        hasFlashed: false
    }));

    return {
        flashes,
        grid: updatedGrid
    };
}

const printGrid = (grid, ID) => {
    const gridString = grid.map((row) =>
        row.map((spot) => spot.value > 9 ? 'm' : spot.value).join('')
    ).join('\n');

    console.log(`gridString (${ID}):\n\n`, gridString, '\n');
}

const countFlashes = (grid, moves) => {
    let flashes = 0;
    let updatedGrid = grid;
    for (let i = 0; i < moves; i++) {
        const resultOfMove = makeMove(updatedGrid);
        updatedGrid = resultOfMove.grid;
        flashes += resultOfMove.flashes;
    }

    return flashes;
}

const findWhenAllFlash = (grid) => {
    let lastNumberOfFlashes = 0;
    let moveIndex = 1;
    let updatedGrid = grid;

    while(lastNumberOfFlashes < grid.length * grid[0].length) {
        const resultOfMove = makeMove(updatedGrid);
        updatedGrid = resultOfMove.grid;
        lastNumberOfFlashes = resultOfMove.flashes;
        moveIndex++;
    }

    return moveIndex
}

const grid = getStartingGrid();
const part1Answer = countFlashes(grid, 100);
console.log('part1Answer', part1Answer);
const part2Answer = findWhenAllFlash(grid);
console.log('part2Answer', part2Answer);