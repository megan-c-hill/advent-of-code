import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day2/day2.txt';

const calculatePosition = () => {
    const instructions = readDataIntoArray(FILE_NAME, false);

    return instructions.reduce((position, instruction) => {
        const instructionArray = instruction.split(' ');

        console.log('instructionArray', instructionArray);

        const direction = instructionArray[0];
        const amount = Number(instructionArray[1]);

        if (direction === 'forward') {
            position.horizontalPosition += amount;
        } else if (direction === 'down') {
            position.depth += amount;
        } else {
            position.depth -= amount;
        }

        return position;
    }, {
        depth: 0,
        horizontalPosition: 0
    });
};

const calculateAim = () => {
    const instructions = readDataIntoArray(FILE_NAME, false);

    return instructions.reduce((position, instruction) => {
        const instructionArray = instruction.split(' ');

        console.log('instructionArray', instructionArray);

        const direction = instructionArray[0];
        const amount = Number(instructionArray[1]);

        if (direction === 'forward') {
            position.horizontalPosition += amount;
            position.depth += (position.aim * amount);
        } else if (direction === 'down') {
            position.aim += amount;
        } else {
            position.aim -= amount;
        }

        return position;
    }, {
        aim: 0,
        depth: 0,
        horizontalPosition: 0
    });
}

// Part 1
const calculatedPosition = calculatePosition();
const part1Answer = calculatedPosition.depth * calculatedPosition.horizontalPosition;

console.log('part1Answer', part1Answer);

// Part 2
const calculatedAim = calculateAim();
const part2Answer = calculatedAim.depth * calculatedAim.horizontalPosition;

console.log('part2Answer', part2Answer);