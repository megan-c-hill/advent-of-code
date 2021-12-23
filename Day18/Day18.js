import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day18/Day18.txt';

const readData = () => readDataIntoArray(FILE_NAME, false, '\n');

const addArrays = (arrayString1, arrayString2) => `[${arrayString1},${arrayString2}]`;

const splitArray = (arrayString) => {
    const numbersToSplit = arrayString.split(/,|\[|\]/).filter((str) => str !== '' && Number(str) >= 10);
    if (!numbersToSplit.length) return arrayString;

    const numberToSplit = numbersToSplit[0];
    const index = arrayString.indexOf(numberToSplit);

    return arrayString.substring(0, index) + `[${Math.floor(numberToSplit / 2)},${Math.ceil(numberToSplit / 2)}]` + arrayString.substring(index + numberToSplit.length);
}

const getMaxDepthData = (arrayString) => {
    let indexOfMaxDepth = -1;
    let maxDepth = 0;
    let nestedCount = 0;

    arrayString.split('').forEach((char, index) => {
        if (char === '[') nestedCount++;
        if (char === ']') nestedCount--;

        if (nestedCount > maxDepth) {
            maxDepth = nestedCount;
            indexOfMaxDepth = index;
        }
    });

    return {
        maxDepth,
        indexOfMaxDepth
    }
}

const getPreviousNumber = (arrayString, indexOfMaxDepth) => {
    let finalIndex = -1;
    let initialIndex = -1;
    for (let i = indexOfMaxDepth; i > 0; i--) {
        if (!isNaN(arrayString.charAt(i))) {
            finalIndex = i;

            const substring = arrayString.substring(0, finalIndex);
            initialIndex = Math.max(substring.lastIndexOf('['), substring.lastIndexOf(',')) + 1;

            return {
                index: initialIndex,
                number: Number(arrayString.substring(initialIndex, finalIndex + 1))
            }
        }
    }

    return {
        index: -1,
        number: -1
    }
}

const getFirstNumber = (arrayString, indexOfMaxDepth) => {
    const index = indexOfMaxDepth + 1;
    const finalIndex = index + arrayString.substring(index).indexOf(',');
    return {
        index: indexOfMaxDepth + 1,
        number: Number(arrayString.substring(index, finalIndex))
    }
};

const getSecondNumber = (arrayString, indexOfMaxDepth) => {
    const initialIndex = indexOfMaxDepth + 1 + arrayString.substring(indexOfMaxDepth).indexOf(',');
    const finalIndex = initialIndex + arrayString.substring(initialIndex).indexOf(']');

    return {
        index: initialIndex,
        number: Number(arrayString.substring(initialIndex, finalIndex))
    }
}

const getNextNumber = (arrayString, indexOfEndOfSecondNumber) => {
    let finalIndex = -1;
    let initialIndex = -1;
    for (let i = indexOfEndOfSecondNumber; i < arrayString.length; i++) {
        if (!isNaN(arrayString.charAt(i))) {
            initialIndex = i;

            const substring = arrayString.substring(initialIndex);
            const indexOfBracket = substring.indexOf(']');
            const indexOfComma = substring.indexOf(',');
            const amountToAdd = indexOfComma === -1 ? indexOfBracket : Math.min(indexOfBracket, indexOfComma)

            finalIndex = initialIndex + amountToAdd;

            return {
                index: initialIndex,
                number: Number(arrayString.substring(initialIndex, finalIndex))
            }
        }
    }

    return {
        index: -1,
        number: -1
    }
}


const explodeArray = (arrayString) => {
    const maxDepthData = getMaxDepthData(arrayString);

    if (maxDepthData.maxDepth < 5) {
        return arrayString;
    }

    const {
        index: indexOfPreviousNumber,
        number: previousNumber
    } = getPreviousNumber(arrayString, maxDepthData.indexOfMaxDepth);
    const {index: indexOfFirstNumber, number: firstNumber} = getFirstNumber(arrayString, maxDepthData.indexOfMaxDepth);
    const {
        index: indexOfSecondNumber,
        number: secondNumber
    } = getSecondNumber(arrayString, maxDepthData.indexOfMaxDepth);
    const {
        index: indexOfNextNumber,
        number: nextNumber
    } = getNextNumber(arrayString, indexOfSecondNumber + secondNumber.toString().length);

    let nextString = '';

    if (previousNumber === -1) {
        nextString += arrayString.substring(0, indexOfFirstNumber - 1);
    } else {
        nextString += arrayString.substring(0, indexOfPreviousNumber) + (previousNumber + firstNumber) + arrayString.substring(indexOfPreviousNumber + previousNumber.toString().length, indexOfFirstNumber - 1);
    }

    nextString += 0

    if (nextNumber === -1) {
        nextString += arrayString.substring(indexOfSecondNumber + secondNumber.toString().length + 1);
    } else {
        nextString += arrayString.substring(indexOfSecondNumber + secondNumber.toString().length + 1, indexOfNextNumber) + (secondNumber + nextNumber) + arrayString.substring(indexOfNextNumber + nextNumber.toString().length);
    }

    return nextString
}

const addAndReduce = (arrays) => {
    let accumArray = arrays[0]
    for (let i = 1; i < arrays.length; i++) {
        accumArray = addArrays(accumArray, arrays[i]);
        let prevArray = '';

        while (accumArray !== prevArray) {
            while (accumArray !== prevArray) {
                prevArray = accumArray;
                accumArray = explodeArray(accumArray);
            }

            accumArray = splitArray(accumArray);
        }
    }

    return accumArray;
}

const getMagnitude = (arr) => {
    if (!isNaN(Number(arr))) {
        return Number(arr);
    }

    return 3 * getMagnitude(arr[0]) + 2 * getMagnitude(arr[1]);
}

const getMaxMagnitude = (arrays) => {
    let maxMagnitude = 0;
    for (let i = 0; i < arrays.length; i++) {
        for (let j = 0; j < arrays.length; j++) {
            let accumArray = addArrays(arrays[i], arrays[j]);
            let prevArray = '';

            while (accumArray !== prevArray) {
                while (accumArray !== prevArray) {
                    prevArray = accumArray;
                    accumArray = explodeArray(accumArray);
                }

                accumArray = splitArray(accumArray);
            }

            const magnitude = getMagnitude(JSON.parse(accumArray));

            if (magnitude > maxMagnitude) maxMagnitude = magnitude;
        }
    }
    return maxMagnitude;
}

const arrays = readData();

const finalResult = addAndReduce(arrays);
const part1Answer = getMagnitude(JSON.parse(finalResult));
console.log('part1Answer', part1Answer);

const part2Answer = getMaxMagnitude(arrays);
console.log('part2Answer', part2Answer);

