import {readDataIntoArray} from "../utils/readDataIntoArray";

const FILE_NAME = './Day10/Day10Sample.txt';
const validStartingCharacters = ['(', '[', '{', '<']

const isCorrupted = (stringArray, indexOfStartingCharacter) => {
    if(!validStartingCharacters.includes(stringArray[indexOfStartingCharacter])) {
        return true;
    }

    // More logic needs to happen here
}

const findCorruptedLines = () => {
    const lines = readDataIntoArray(FILE_NAME, false);
    
    lines.forEach((line) => {
        isCorrupted(line.split(''), 0)
    })
}

{([(<{}[<>[]}>{[]{[(<()>