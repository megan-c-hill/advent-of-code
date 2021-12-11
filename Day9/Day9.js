import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day9/Day9.txt';

const parseData = () => {
    const data = readDataIntoArray(FILE_NAME, false, '\n');

    return data.map((row) => row.split('').map((digit) => Number(digit)));
}

const addCaveSpotToArray = (array, spots, rowIndex, columnIndex) => {
    if (rowIndex >= 0 && columnIndex >= 0 && rowIndex < spots.length && columnIndex < spots[0].length) {
        array.push({
            spot: spots[rowIndex][columnIndex],
            rowIndex,
            columnIndex
        });
    }
}

const adjacentNumbers = (caves, rowIndex, columnIndex) => {
    const adjacentSpots = [];

    addCaveSpotToArray(adjacentSpots, caves, rowIndex, columnIndex - 1);
    addCaveSpotToArray(adjacentSpots, caves, rowIndex, columnIndex + 1);
    addCaveSpotToArray(adjacentSpots, caves, rowIndex - 1, columnIndex);
    addCaveSpotToArray(adjacentSpots, caves, rowIndex + 1, columnIndex);

    return adjacentSpots
}

const findLowPoints = (caves) => {
    const lowPoints = [];

    caves.forEach((row, rowIndex) => {
        row.forEach((spot, columnIndex) => {
            const isLowPoint = adjacentNumbers(caves, rowIndex, columnIndex).every((lowPoint) => lowPoint.spot > spot);

            if (isLowPoint) {
                lowPoints.push({
                    spot,
                    columnIndex,
                    rowIndex
                });
            }
        })
    });

    return lowPoints;
}

const basinIncludes = (basin, spot) => basin.some(spotInBase => JSON.stringify(spotInBase) === JSON.stringify(spot));

const findBasin = (caves, rowIndex, columnIndex, existingBasin) => {
    const adjacentSpots = adjacentNumbers(caves, rowIndex, columnIndex);
    const currentSpot = {
        spot: caves[rowIndex][columnIndex],
        rowIndex,
        columnIndex
    }

    if(basinIncludes(existingBasin, currentSpot)) {
        return existingBasin
    }

    existingBasin.push(currentSpot);
    
    if (adjacentSpots.every((adjacentSpot) => adjacentSpot.spot === 9 || basinIncludes(existingBasin, adjacentSpot))) {
        return existingBasin
    }

    const spotsToFindBasin = adjacentSpots.filter((adjacentSpot) => adjacentSpot.spot !== 9 && !basinIncludes(existingBasin, adjacentSpot));
    
    return spotsToFindBasin.reduce((accum, spotToFindBasin) =>
        findBasin(caves, spotToFindBasin.rowIndex, spotToFindBasin.columnIndex, existingBasin)
    , existingBasin);
}

const findBasins = (caves, lowPoints) => {
    const basins = lowPoints.map((lowPoint) => findBasin(caves, lowPoint.rowIndex, lowPoint.columnIndex, []));

    return basins.sort((a, b) => b.length - a.length);
}

const caves = parseData();
const lowPoints = findLowPoints(caves);
const part1Answer = lowPoints.reduce((accum, lowPoint) => accum += lowPoint.spot + 1, 0);
console.log('part1Answer', part1Answer);

const basins = findBasins(caves, lowPoints);
const part2Answer = basins.slice(0, 3).reduce((accum, basin) => accum *= basin.length, 1);
console.log('part2Answer', part2Answer);