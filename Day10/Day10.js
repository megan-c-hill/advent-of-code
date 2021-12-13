import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day10/Day10.txt';
const startingCharacters = ['(', '[', '{', '<'];
const closingCharacters = [')', ']', '}', '>'];
const corruptionValues = [3, 57, 1197, 25137];
const autocompleteValues = [1, 2, 3, 4];

const sortLinesByStatus = () => {
    const lines = readDataIntoArray(FILE_NAME, false);
    const corruptedCharacters = [];
    const incompleteLines = [];

    lines.forEach((line) => {
        let corruptedCharacter = null;
        let lastUnclosed = {
            value: null,
            prev: null
        };

        line.split('').forEach((character, index) => {
            if (startingCharacters.includes(character)) {
                lastUnclosed = {
                    value: character,
                    prev: lastUnclosed
                };
            } else {
                if (startingCharacters.indexOf(lastUnclosed.value) === closingCharacters.indexOf(character)) {
                    lastUnclosed = {
                        value: lastUnclosed.prev.value,
                        prev: lastUnclosed.prev.prev
                    }
                } else if (!corruptedCharacter) {
                    corruptedCharacter = character
                }
            }
        });

        if (corruptedCharacter) {
            corruptedCharacters.push(corruptedCharacter);
        } else if (lastUnclosed.value !== null) {
            incompleteLines.push(lastUnclosed);
        }
    });

    return {
        corruptedCharacters,
        incompleteLines
    };
};

const computeValueOfCorruptedLines = (corruptedCharacters) => corruptedCharacters.reduce((accum, character) => accum += corruptionValues[closingCharacters.indexOf(character)], 0);

const computeValueOfIncompleteLines = (incompleteLines) => {
    const allScores = incompleteLines.map((lastUnclosed) => {
        let characterToClose = lastUnclosed;
        let valueForLine = 0;
        while (characterToClose.value) {
            valueForLine *= 5;
            valueForLine += autocompleteValues[startingCharacters.indexOf(characterToClose.value)];
            characterToClose = characterToClose.prev;
        }
        return valueForLine;
    });
    
    const sortedScores = allScores.sort((a, b) => a -b);

    return sortedScores[Math.floor(sortedScores.length / 2)];
}

const {corruptedCharacters, incompleteLines} = sortLinesByStatus();
const part1Answer = computeValueOfCorruptedLines(corruptedCharacters);
console.log('part1Answer', part1Answer);
const part2Answer = computeValueOfIncompleteLines(incompleteLines);
console.log('part2Answer', part2Answer);