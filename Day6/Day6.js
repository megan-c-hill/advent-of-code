import fs from "fs";

const FILE_NAME = './Day6/day6.txt';
const regenerationRate = 7;
const timeBeforeRegenerating = 2;

const readInstructionsFromFile = () => fs.readFileSync(FILE_NAME, 'utf8').split(',').map((fish) => Number(fish));

const birthNewFish = (existingFish) => {
    const newFishToAdd = [];
    const updatedExistingFish = existingFish.map((currentFish) => {
        if (currentFish > 0) {
            return currentFish - 1;
        }

        newFishToAdd.push(regenerationRate - 1 + timeBeforeRegenerating);
        return regenerationRate - 1;

    });

    return [...updatedExistingFish, ...newFishToAdd];
};

const countNumberOfFishAfterDay = (days) => {
    let fishCounts = readInstructionsFromFile();

    for (let i = 0; i < days; i++) {
        fishCounts = birthNewFish(fishCounts);

    }
    return fishCounts.length;
}

const generateInitialDayObject = (fishCounts) => {
    const dayOfReproductionObject = {};
    for (let i = 0; i < regenerationRate + timeBeforeRegenerating - 1; i++) {
        dayOfReproductionObject[i] = fishCounts.filter((fishCount) => fishCount === i).length;
    }

    return dayOfReproductionObject

}

const shiftReproductionCounts = (currentReproductionCounts) =>
    Object.entries(currentReproductionCounts).reduce((accum, [key, value]) => {
        if (Number(key) === 0) {
            accum[regenerationRate - 1] = value;
            accum[regenerationRate + timeBeforeRegenerating - 1] = value;
        } else {
            const currentValue = accum[Number(key) - 1] || 0;
            accum[Number(key) - 1] = currentValue + value;
        }

        return accum
    }, {});

const countNumberOfFishAfterDayForBigNumbers = (days) => {
    let fishCounts = readInstructionsFromFile();
    let dayOfReproductionCounts = generateInitialDayObject(fishCounts);
    for (let i = 0; i < days; i++) {
        dayOfReproductionCounts = shiftReproductionCounts(dayOfReproductionCounts)
    }

    return Object.values(dayOfReproductionCounts).reduce((accum, value) => accum += value, 0)
}


const part1Answer = countNumberOfFishAfterDay(80);
const part1AnswerCheck = countNumberOfFishAfterDayForBigNumbers(80);
console.log('part1Answer', part1Answer);
console.log('part1AnswerCheck', part1AnswerCheck);
const part2Answer = countNumberOfFishAfterDayForBigNumbers(256);
console.log('part2Answer', part2Answer);