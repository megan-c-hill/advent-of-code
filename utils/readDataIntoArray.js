import fs from 'fs';

export const readDataIntoArray = (fileName, isNumber) => {
    const stringArray =  fs.readFileSync(fileName, 'utf8').split('\n');

    if(!isNumber) {
        return stringArray
    }

    return stringArray.map((str) => Number(str));
}