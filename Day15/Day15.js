import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day15/Day15.txt';

const readDataIntoGrid = () => {
    const rows = readDataIntoArray(FILE_NAME, false, '\n');

    return rows.map((row) =>
        row.split('').map((digit) => Number(digit))
    );
}

const computeKey = (x, y) => `${x},${y}`;

const computeNextNodes = (grid, x, y) => {
    const possibleNodes = [{x: x - 1, y}, {x: x + 1, y}, {x, y: y - 1}, {x, y: y + 1}];

    return possibleNodes.reduce((accum, possibleNode) => {
        if (possibleNode.x >= 0 && possibleNode.x < grid[0].length && possibleNode.y >= 0 && possibleNode.y < grid.length) {
            accum.push(computeKey(possibleNode.x, possibleNode.y))
        }
        return accum;

    }, []);
}

const increaseSizeOfGrid = (grid) => {
    let bigGrid = [];
    for (let yIndex = 0; yIndex < grid.length * 5; yIndex++) {
        let row = [];
        for (let xIndex = 0; xIndex < grid[0].length * 5; xIndex++) {
            const valueInKnownGrid = grid[yIndex % grid.length][xIndex % grid[0].length];
            const amountToChange = Math.floor(yIndex / grid.length) + Math.floor(xIndex / grid[0].length);
            let newValue = valueInKnownGrid + amountToChange;
            if(newValue > 9) {
                newValue = newValue % 9
            }

            row.push(newValue);
        }
        bigGrid.push(row);
    }
    return bigGrid;
}

const readGridIntoTree = (grid) => {
    let treeObject = {};
    for (let yIndex = 0; yIndex < grid.length; yIndex++) {
        for (let xIndex = 0; xIndex < grid[0].length; xIndex++) {
            treeObject[computeKey(xIndex, yIndex)] = {
                value: grid[xIndex][yIndex],
                hasVisited: false,
                nextNodes: computeNextNodes(grid, xIndex, yIndex),
                minDistance: xIndex === 0 && yIndex === 0 ? 0 : Number.MAX_SAFE_INTEGER
            }
        }
    }

    return treeObject;
}

const computeNextCurrent = (tree) => {
    const unvisitedEntries = Object.entries(tree).filter(([key, value]) => !value.hasVisited);

    if (unvisitedEntries.length === 0) {
        return null;
    }

    const entriesSortedByDistance = unvisitedEntries.sort(([firstNodeKey, firstNodeValue], [secondNodeKey, secondNodeValue]) => firstNodeValue.minDistance - secondNodeValue.minDistance);

    return entriesSortedByDistance[0][0];
}

const computeAllPathsThroughTree = (tree) => {
    let current = computeKey(0, 0);
    while (current !== null) {
        const unvisitedNeighbors = tree[current].nextNodes.filter((nextNode) => !tree[nextNode].hasVisited);

        unvisitedNeighbors.forEach((neighbor) => {
            const lengthToNode = tree[current].minDistance + tree[neighbor].value;

            if (tree[neighbor].minDistance > lengthToNode) {
                tree[neighbor].minDistance = lengthToNode;
            }
        });

        tree[current].hasVisited = true;

        current = computeNextCurrent(tree);
    }

    return tree
}

const grid = readDataIntoGrid();
// const tree = readGridIntoTree(grid);
// const treeWithComputedDistances = computeAllPathsThroughTree(tree);
// const part1Answer = treeWithComputedDistances[computeKey(grid[0].length - 1, grid.length - 1)].minDistance;
// console.log('part1Answer', part1Answer);
const bigGrid = increaseSizeOfGrid(grid);
const tree = readGridIntoTree(bigGrid);
const bigTreeWithComputedDistances = computeAllPathsThroughTree(tree);
const part2Answer = bigTreeWithComputedDistances[computeKey(bigGrid[0].length - 1, bigGrid.length - 1)].minDistance;
console.log('part2Answer', part2Answer);

