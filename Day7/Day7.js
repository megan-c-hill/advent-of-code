import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day7/Day7.txt';

const findMedian = (crabPositions) =>
    crabPositions.sort((a, b) => a - b)[crabPositions % 2 === 0 ? Math.floor(crabPositions.length / 2) : Math.floor(crabPositions.length / 2) - 1];

const calculateAmountOfMovement = (crabPositions, newPosition) =>
    crabPositions.reduce((accum, position) => accum += Math.abs(newPosition - position), 0)


const moveCrabsToPositionMinimizingDistance = () => {
    const initialCrabPositions = readDataIntoArray(FILE_NAME, true, ',');
    const median = findMedian(initialCrabPositions);
    return calculateAmountOfMovement(initialCrabPositions, median);
};

const moveCrabsToPositionMinimizingFuel = () => {
    const initialCrabPositions = readDataIntoArray(FILE_NAME, true, ',');
    let lastFuel;

    for (let i = 0; i < Math.max(...initialCrabPositions); i++) {
        let totalFuel = 0;
        initialCrabPositions.forEach((position) => {
            const distance = Math.abs(i - position);
            totalFuel += (distance * (distance + 1)) / 2;
        });

        if(lastFuel && lastFuel < totalFuel) {
            return lastFuel;
        } 
        
        lastFuel = totalFuel
    }
};

const part1Answer = moveCrabsToPositionMinimizingDistance();
console.log('part1Answer', part1Answer);
const part2Answer = moveCrabsToPositionMinimizingFuel();
console.log('part2Answer', part2Answer);