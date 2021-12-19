import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day17/Day17.txt';

const getTargetArea = () => {
    const targetArea = readDataIntoArray(FILE_NAME, false, '\n')[0];
    const coords = targetArea.split(':')[1].trim();
    const [xCoords, yCoords] = coords.split(', ');

    return {
        x: [Number(xCoords.split('..')[0].substring(2)), Number(xCoords.split('..')[1])],
        y: [Number(yCoords.split('..')[0].substring(2)), Number(yCoords.split('..')[1])],
    }
}

const doStep = (startingPosition, previousVelocity) => {
    let changeInX = 0;

    if (previousVelocity.x > 0) changeInX = -1;
    else if (previousVelocity.x < 0) changeInX = 1;

    return {
        position: {
            x: startingPosition.x + previousVelocity.x,
            y: startingPosition.y + previousVelocity.y
        },
        velocity: {
            x: previousVelocity.x + changeInX,
            y: previousVelocity.y - 1
        }
    }
}

const isInTargetArea = (position, targetArea) =>
    position.x >= Math.min(...targetArea.x) && position.x <= Math.max(...targetArea.x) &&
    position.y >= Math.min(...targetArea.y) && position.y <= Math.max(...targetArea.y);


const hasOvershotTargetArea = (position, targetArea) => position.x > Math.max(...targetArea.x) || position.y < Math.min(...targetArea.y);

const getAllViableVelocities = (targetArea) => {
    const allViableVelocities = [];
    for (let xVelocityToCheck = 0; xVelocityToCheck <= Math.max(...targetArea.x); xVelocityToCheck++) {
        for (let yVelocityToCheck = Math.min(...targetArea.y); yVelocityToCheck < 1000; yVelocityToCheck++) { // May need to tweak this
            let position = {
                x: 0,
                y: 0
            }
            let velocityToUse = {
                x: xVelocityToCheck,
                y: yVelocityToCheck
            }

            while (!hasOvershotTargetArea(position, targetArea) && !isInTargetArea(position, targetArea)) {
                const responseAfterStep = doStep(position, velocityToUse);
                position = responseAfterStep.position;
                velocityToUse = responseAfterStep.velocity;
            }

            if (isInTargetArea(position, targetArea)) {
                allViableVelocities.push({
                    x: xVelocityToCheck,
                    y: yVelocityToCheck
                })
            }
        }
    }

    return allViableVelocities
}

const findHeightOfMaxVelocity = (allVelocities) => {
    const maxVelocityToCompute = allVelocities.sort((a, b) => b.y - a.y)[0];

    let maxHeight = 0;
    let position = {
        x: 0,
        y: 0
    }
    let velocityToUse = {
        x: maxVelocityToCompute.x,
        y: maxVelocityToCompute.y
    }

    while (!hasOvershotTargetArea(position, targetArea) && !isInTargetArea(position, targetArea)) {
        const responseAfterStep = doStep(position, velocityToUse);
        position = responseAfterStep.position;
        velocityToUse = responseAfterStep.velocity;

        if (position.y > maxHeight) {
            maxHeight = position.y
        }
    }
    return maxHeight;
}

const targetArea = getTargetArea();
const allVelocities = getAllViableVelocities(targetArea);
const part1Answer = findHeightOfMaxVelocity(allVelocities);
console.log('part1Answer', part1Answer);
const part2Answer = allVelocities.length;
console.log('part2Answer', part2Answer);