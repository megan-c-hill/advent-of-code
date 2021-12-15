import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day13/Day13.txt';

const getPointsAndInstructions = () => {
    const [rawPoints, rawInstructions] = readDataIntoArray(FILE_NAME, false, '\n\n');

    const points = rawPoints.split('\n').map((point) => {
        const [start, end] = point.split(',');

        return {
            x: Number(start),
            y: Number(end)
        }
    });

    const instructions = rawInstructions.split('\n').map((rawInstruction) => {
        const [axisString, coordinate] = rawInstruction.split('=');

        return {
            axis: axisString.substring(axisString.length - 2).trim(),
            coordinate: Number(coordinate)
        }
    });

    return {
        points,
        instructions
    }
};

const createEmptyGrid = (width, height) => {
    const grid = [];
    for (let numberOfRows = 0; numberOfRows <= height; numberOfRows++) {
        const row = [];
        for (let numberOfItems = 0; numberOfItems <= width; numberOfItems++) {
            row.push({isPoint: false});
        }
        grid.push(row);
    }

    return grid;
}
const computeGridFromPoints = (points) => {
    const width = Math.max(...points.map((point) => point.x));
    const height = Math.max(...points.map((point) => point.y));

    const grid = createEmptyGrid(width, height);

    points.forEach((point) => {
        grid[point.y][point.x].isPoint = true
    });

    return grid;
};

const printGrid = (grid) => {
    const string = grid.reduce((fullAccum, row) =>
            fullAccum += row.reduce((rowAccum, spot) =>
                    rowAccum += spot.isPoint ? '#' : '.'
                , '') + '\n'
        , '');

    console.log(string);
}

const foldPaper = (previousGrid, axis, coordinate) => {
    const newGrid = axis === 'x' ? createEmptyGrid(coordinate - 1, previousGrid.length) : createEmptyGrid(previousGrid[0].length, coordinate - 1);

    if (axis === 'x') {
        for (let columnIndex = 0; columnIndex < previousGrid.length; columnIndex++) {
            for (let rowDiff = 1; rowDiff <= coordinate; rowDiff++) {
                newGrid[columnIndex][coordinate - rowDiff].isPoint = previousGrid[columnIndex][coordinate - rowDiff].isPoint || previousGrid[columnIndex][coordinate + rowDiff].isPoint;
            }
        }
    } else {
        for (let columnDiff = 1; columnDiff <= coordinate; columnDiff++) {
            for (let rowIndex = 0; rowIndex < previousGrid[0].length; rowIndex++) {
                newGrid[coordinate - columnDiff][rowIndex].isPoint = previousGrid[coordinate - columnDiff][rowIndex].isPoint || previousGrid[coordinate + columnDiff][rowIndex].isPoint;
            }
        }
    }

    return newGrid;
}

const doAllFolds = (grid, instructions) => {
    let lastGrid = grid;
    instructions.forEach((instruction) => {
        lastGrid = foldPaper(lastGrid, instruction.axis, instruction.coordinate);
    });

    return lastGrid;
}

const {points, instructions} = getPointsAndInstructions();
const grid = computeGridFromPoints(points);

const gridAfterOneMove = foldPaper(grid, instructions[0].axis, instructions[0].coordinate);
const partOneAnswer = gridAfterOneMove.reduce((accum, row) => accum += row.reduce((rowAccum, point) => rowAccum += point.isPoint ? 1 : 0, 0), 0);
console.log('partOneAnswer', partOneAnswer);
const gridAfterAllFolds = doAllFolds(grid, instructions);
printGrid(gridAfterAllFolds);

/*
.##..###..#..#...##.####.###...##...##.....
#..#.#..#.#.#.....#.#....#..#.#..#.#..#....
#..#.###..##......#.###..###..#....#.......
####.#..#.#.#.....#.#....#..#.#.##.#.......
#..#.#..#.#.#..#..#.#....#..#.#..#.#..#....
#..#.###..#..#..##..#....###...###..##.....
ABKJFBGC
 */

