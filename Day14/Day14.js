import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day14/Day14.txt';

const getStartingStringAndRules = () => {
    const [startingString, rulesString] = readDataIntoArray(FILE_NAME, false, '\n\n');

    const rules = rulesString.split('\n').reduce((accum, ruleString) => {
        const [stringToFind, stringToInsert] = ruleString.split(' -> ');

        accum[stringToFind] = stringToInsert;

        return accum;
    }, {});

    const startingPairs = {};
    for (let stringIndex = 0; stringIndex < startingString.length - 1; stringIndex++) {
        const pairOfLetters = startingString.substring(stringIndex, stringIndex + 2);

        if (!startingPairs[pairOfLetters]) {
            startingPairs[pairOfLetters] = 0;
        }
        startingPairs[pairOfLetters] = startingPairs[pairOfLetters] + 1
    }

    return {startingString, startingPairs, rules};
}

const getStringAfterMoves = (startingString, rules, numberOfMoves) => {
    let previousString = startingString;
    let nextString = '';
    for (let count = 0; count < numberOfMoves; count++) {
        nextString = '';
        for (let stringIndex = 0; stringIndex < previousString.length - 1; stringIndex++) {
            const pairOfLetters = previousString.substring(stringIndex, stringIndex + 2);
            nextString += previousString.charAt(stringIndex) + rules[pairOfLetters];
        }
        nextString += previousString.charAt(previousString.length - 1);
        previousString = nextString;
    }
    return nextString;
};

const computePartOneAnswer = (polymerString) => {
    const letterCounts = polymerString.split('').reduce((accum, letter) => {
        if (!accum[letter]) {
            accum[letter] = 0;
        }
        accum[letter] = accum[letter] + 1;

        return accum;
    }, {});

    const max = Math.max(...Object.values(letterCounts));
    const min = Math.min(...Object.values(letterCounts));

    return max - min;
}

const differenceInNumbersAfterMoves = (startingString, startingPairs, rules, numberOfMoves) => {
    let pairs = startingPairs;
    for (let count = 0; count < numberOfMoves; count++) {
        pairs = Object.entries(pairs).reduce((accum, [key, value]) => {
            const firstPairCreated = key.charAt(0) + rules[key];
            const secondPairCreated = rules[key] + key.charAt(1);

            if (!accum[firstPairCreated]) {
                accum[firstPairCreated] = 0;
            }
            if (!accum[secondPairCreated]) {
                accum[secondPairCreated] = 0;
            }

            accum[firstPairCreated] = accum[firstPairCreated] + value;
            accum[secondPairCreated] = accum[secondPairCreated] + value;

            return accum;
        }, {});
    }

    const countForEachLetter = Object.entries(pairs).reduce((accum, [pair, numberOfPair]) => {
        const letters = pair.split('');

        letters.forEach((letter) => {
            if (!accum[letter]) {
                accum[letter] = 0
            }

            accum[letter] += numberOfPair
        });

        return accum;
    }, {});

    countForEachLetter[startingString.charAt(0)] = countForEachLetter[startingString.charAt(0)] + 1;
    countForEachLetter[startingString.charAt(startingString.length - 1)] = countForEachLetter[startingString.charAt(startingString.length - 1)] + 1;
    
    const updatedCount = Object.entries(countForEachLetter).reduce((accum, [letter, count]) => {
        accum[letter] = count / 2;
        
        return accum;
    }, {});
    
    const max = Math.max(...Object.values(updatedCount));
    const min = Math.min(...Object.values(updatedCount));

    return max - min;
}

const {startingString, startingPairs, rules} = getStartingStringAndRules();
const stringAfterTenMoves = getStringAfterMoves(startingString, rules, 10);
const part1Answer = computePartOneAnswer(stringAfterTenMoves);
const part1AnswerCheck = differenceInNumbersAfterMoves(startingString, startingPairs, rules, 10);
console.log('part1Answer', part1Answer);
console.log('part1AnswerCheck', part1AnswerCheck);
const part2Answer = differenceInNumbersAfterMoves(startingString, startingPairs, rules, 40);
console.log('part2Answer', part2Answer);
