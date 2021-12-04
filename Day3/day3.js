import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day3/day3.txt';

const calculateGammaRate = () => {
    const instructions = readDataIntoArray(FILE_NAME, false);

    const numberOfDigits = instructions[0].length;
    let result = '';

    for (let i = 0; i < numberOfDigits; i++) {
        let oneCount = 0;
        let zeroCount = 0;

        for (let j = 0; j < instructions.length; j++) {
            instructions[j].charAt(i) === '1' ? oneCount++ : zeroCount++
        }

        oneCount > zeroCount ? result += '1' : result += '0'
    }

    return result;
};

const calculatePower = (gammaRate) => {
    const epsilonRate = gammaRate.split('').map((character) => character === '1' ? '0' : '1').join('');

    const gammaRateAsDecimal = parseInt(gammaRate, 2);
    const epsilonRateAsDecimal = parseInt(epsilonRate, 2);

    return gammaRateAsDecimal * epsilonRateAsDecimal;
}

const filterOutAtPosition = (digitToRemove, index, array) =>
    array.reduce((accum, element) => {
        if(element.charAt(index) !== digitToRemove) {
            accum.push(element)
        }

        return accum;
    }, []);

const calculateOxygenOrCO2Rate = (compareFunction) => {
    let instructions = readDataIntoArray(FILE_NAME, false);

    let index = 0;
    while (instructions.length > 1) {
        let oneCount = 0;
        let zeroCount = 0;

        for (let j = 0; j < instructions.length; j++) {
            instructions[j].charAt(index) === '1' ? oneCount++ : zeroCount++
        }

        instructions = filterOutAtPosition(compareFunction(oneCount, zeroCount) ? '0' : '1', index, instructions);

        index ++;
    }

    return instructions[0];
}

const calculateLifeSupportRate = (calculatedOxygenRate, calculatedC02Rate) => {
    const oxygenRateAsDecimal = parseInt(calculatedOxygenRate, 2);
    const C02RateAsDecimal = parseInt(calculatedC02Rate, 2);

    return oxygenRateAsDecimal * C02RateAsDecimal;
}

// Part 1
const calculatedGamma = calculateGammaRate();
const part1Answer = calculatePower(calculatedGamma);

console.log('part1Answer', part1Answer);

// Part 2
const calculatedOxygenRate = calculateOxygenOrCO2Rate((oneCount, zeroCount) => oneCount >= zeroCount);
const calculatedC02Rate = calculateOxygenOrCO2Rate((oneCount, zeroCount) => oneCount < zeroCount);
const part2Answer = calculateLifeSupportRate(calculatedOxygenRate, calculatedC02Rate);

console.log('part2Answer', part2Answer);
