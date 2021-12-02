// Part 1
import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day1/day1.txt'

const computeSumOfArray = (array) => array.reduce((accum, elem) => accum + elem, 0);

// Spoofing a queue with JavaScript arrays
const addElementToArray = (array, element, maxArraySize) => {
    array.push(element);

    if(array.length > maxArraySize) {
        array.shift();
    }
}

export const computeNumberOfDepthIncreases = () => {
    const depthArr = readDataIntoArray(FILE_NAME, true);

    let previousNum;

    return depthArr.reduce((accum, currentDepth) => {
        if (previousNum < currentDepth) {
            accum++;
        }

        previousNum = currentDepth;

        return accum;
    }, 0);
};

export const computeNumberOfDepthIncreasesWithSlidingSums = (windowSize) => {
    const depthArr = readDataIntoArray(FILE_NAME, true);

    const previousNums = [];
    const currentNums = [];

    // This would have been shorter using indexes, but I wanted the window size to be dynamic
    return depthArr.reduce((accum, currentDepth) => {
        addElementToArray(currentNums, currentDepth, windowSize);

        if (previousNums.length === windowSize && currentNums.length === windowSize) {
            const currentSum = computeSumOfArray(currentNums);
            const previousSum = computeSumOfArray(previousNums);

            if(currentSum > previousSum) {
                accum++;
            }
        }

        addElementToArray(previousNums, currentDepth, windowSize);

        return accum;
    }, 0);
}

const part1Answer = computeNumberOfDepthIncreases();
console.log('part1Answer', part1Answer);
console.log('verifyPart1Answer', computeNumberOfDepthIncreasesWithSlidingSums(1));
// 1583

const part2Answer = computeNumberOfDepthIncreasesWithSlidingSums(3);
console.log('part2Answer', part2Answer);
// 1627