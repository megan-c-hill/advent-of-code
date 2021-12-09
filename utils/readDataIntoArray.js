import fs from 'fs';

export const readDataIntoArray = (fileName, isNumber, splitChar = '\n') => {
    const stringArray =  fs.readFileSync(fileName, 'utf8').split(splitChar);

    if(!isNumber) {
        return stringArray
    }

    return stringArray.map((str) => Number(str));
}