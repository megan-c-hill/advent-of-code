import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day8/Day8.txt';

const ZERO_DIGITS = ['a', 'b', 'c', 'e', 'f', 'g']; //6 (d)
const ONE_DIGITS = ['c', 'f'];
const TWO_DIGITS = ['a', 'c', 'd', 'e', 'g']; //5 (b, f)
const THREE_DIGITS = ['a', 'c', 'd', 'f', 'g']; //5 (b, e)
const FOUR_DIGITS = ['b', 'c', 'd', 'f'];
const FIVE_DIGITS = ['a', 'b', 'd', 'f', 'g']; //5 (c, e)
const SIX_DIGITS = ['a', 'b', 'd', 'e', 'f', 'g']; //6 (c)
const SEVEN_DIGITS = ['a', 'c', 'f'];
const EIGHT_DIGITS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const NINE_DIGITS = ['a', 'b', 'c', 'd', 'f', 'g']; //6 (e)

const readInput = () => {
    const signalGroups = readDataIntoArray(FILE_NAME, false, '\n');

    return signalGroups.map((signalGroup) => {
        const [rawSignals, rawOutputs] = signalGroup.split('|');
        const signals = rawSignals.trim().split(' ');
        const outputs = rawOutputs.trim().split(' ');

        return {
            signals,
            outputs
        }
    });
};

const countUniqueNumbers = (signalsAndOutputs) =>
    signalsAndOutputs.reduce((accum, signalAndOutput) => {
        const outputUniqueNumberCounts = signalAndOutput.outputs.filter((output) =>
            output.length === ONE_DIGITS.length || output.length === FOUR_DIGITS.length || output.length === SEVEN_DIGITS.length || output.length === EIGHT_DIGITS.length
        ).length;

        return accum += outputUniqueNumberCounts
    }, 0);

const missingDigits = (signal) =>
    EIGHT_DIGITS.filter((digit) => !signal.split('').includes(digit));


// Steps to determine decoding
// Determine 1, 4, 7, and 8 because they are unique
// Determine 6 because it is the only 6 digit missing C or F, so the one missing is C and the other is F
// Determine 2 because F is known, and it's the only F missing in 5 digits, so B can also be found
// Determine 3 because B is known and the other unknown 5 isn't missing B, (note 3 can not be 2) so E is now also known
// Determine 9 because E is known
// Determine 5 because it's the only 5 left
// Determine 0 because it's the only number left


const addTogetherDecodedOutputs = (signalsAndOutputs) =>
    signalsAndOutputs.reduce((accum, signalAndOutput) => {
        const encodedSignals = signalAndOutput.signals;

        const encodedOne = encodedSignals.find((signal) => signal.length === ONE_DIGITS.length);
        const encodedFour = encodedSignals.find((signal) => signal.length === FOUR_DIGITS.length);
        const encodedSeven = encodedSignals.find((signal) => signal.length === SEVEN_DIGITS.length);
        const encodedEight = encodedSignals.find((signal) => signal.length === EIGHT_DIGITS.length);

        const encodedSix = encodedSignals.find((signal) => signal.length === SIX_DIGITS.length && (missingDigits(signal).includes(encodedOne.charAt(0)) || missingDigits(signal).includes(encodedOne.charAt(1))));
        const encodedC = EIGHT_DIGITS.find((digit) => encodedOne.split('').includes(digit) && !encodedSix.split('').includes(digit));
        const encodedF = encodedOne.split('').find((digit) => digit !== encodedC);

        const encodedTwo = encodedSignals.find((signal) => signal.length === TWO_DIGITS.length && missingDigits(signal).includes(encodedF));
        const encodedB = missingDigits(encodedTwo).find((digit) => digit !== encodedF);

        const encodedThree = encodedSignals.find((signal) => signal.length === THREE_DIGITS.length && missingDigits(signal).includes(encodedB) && signal !== encodedTwo);
        const encodedE = missingDigits(encodedThree).find((digit) => digit !== encodedB);

        const encodedNine = encodedSignals.find((signal) => signal.length === NINE_DIGITS.length && missingDigits(signal).includes(encodedE));
        const encodedFive = encodedSignals.find((signal) => signal.length === FIVE_DIGITS.length && missingDigits(signal).includes(encodedC) && missingDigits(signal).includes(encodedE));
        const encodedZero = encodedSignals.find((signal) => signal.length === ZERO_DIGITS.length && signal !== encodedSix && signal !== encodedNine);

        const encodedMap = {
            [encodedZero.split('').sort().join('')]: 0,
            [encodedOne.split('').sort().join('')]: 1,
            [encodedTwo.split('').sort().join('')]: 2,
            [encodedThree.split('').sort().join('')]: 3,
            [encodedFour.split('').sort().join('')]: 4,
            [encodedFive.split('').sort().join('')]: 5,
            [encodedSix.split('').sort().join('')]: 6,
            [encodedSeven.split('').sort().join('')]: 7,
            [encodedEight.split('').sort().join('')]: 8,
            [encodedNine.split('').sort().join('')]: 9
        };

        const decodedOutput = signalAndOutput.outputs.reduce((outputAccum, encodedOutput) => outputAccum += encodedMap[encodedOutput.split('').sort().join('')], '');

        console.log('decodedOutput', decodedOutput);
        return accum += parseInt(decodedOutput);
    }, 0);

const signalAndOutputs = readInput();
const part1Answer = countUniqueNumbers(signalAndOutputs);
console.log('part1Answer', part1Answer);
const part2Answer = addTogetherDecodedOutputs(signalAndOutputs);
console.log('part2Answer', part2Answer);
