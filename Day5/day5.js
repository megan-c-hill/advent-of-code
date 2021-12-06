import fs from "fs";

const FILE_NAME = './Day5/day5.txt';

const readInstructionsFromFile = () => {
    const paths = fs.readFileSync(FILE_NAME, 'utf8').split('\n');

    return paths.map((path) => {
        const instructions = path.split(' -> ');
        return instructions.map((instruction) => {
            const components = instruction.split(',');

            return {
                x: Number(components[0]),
                y: Number(components[1])
            }
        });
    });
};

const keyForInstruction = (x, y) => `${x},${y}`;

const mapAllVents = (instructions, includeDiagonals) =>
    instructions.reduce((accum, instruction) => {
        const x1 = instruction[0].x;
        const y1 = instruction[0].y;
        const x2 = instruction[1].x;
        const y2 = instruction[1].y;

        if (x1 !== x2 && y1 === y2) {
            for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
                const key = keyForInstruction(i, y1);
                if (accum[key]) {
                    accum[key] = accum[key] + 1;
                } else {
                    accum[key] = 1;
                }
            }
        } else if (y1 !== y2 && x1 === x2) {
            for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
                const key = keyForInstruction(x1, i);
                if (accum[key]) {
                    accum[key] = accum[key] + 1;
                } else {
                    accum[key] = 1;
                }
            }
        }

        if(includeDiagonals && x1 !== x2 && y1 !== y2) {
            const xMin = Math.min(x1, x2);
            const xMax = Math.max(x1, x2);
            const yMin = Math.min(y1, y2);
            const yMax = Math.max(y1, y2);

            if(xMin === x1 && yMin === y1 || xMin === x2 && yMin === y2) { // Diagonal increases both directions
                for (let i = 0 ; i <= xMax - xMin; i++) {
                    const key = keyForInstruction(xMin + i, yMin + i);
                    if (accum[key]) {
                        accum[key] = accum[key] + 1;
                    } else {
                        accum[key] = 1;
                    }
                }
            } else { // diagonal increases x and decreases y
                for (let i = 0 ; i <= xMax - xMin; i++) {
                    const key = keyForInstruction(xMin + i, yMax - i);
                    if (accum[key]) {
                        accum[key] = accum[key] + 1;
                    } else {
                        accum[key] = 1;
                    }
                }
            }

        }

        return accum;
    }, {});

const countOverlappingVents = (vents) =>
    Object.values(vents).filter((value) => value > 1).length;

const instructions = readInstructionsFromFile();
const mappedVents = mapAllVents(instructions, false);
const mappedVentsWithHorizontals = mapAllVents(instructions, true);
const part1Answer = countOverlappingVents(mappedVents);
const part2Answer = countOverlappingVents(mappedVentsWithHorizontals);
console.log('part1Answer', part1Answer);
console.log('part2Answer', part2Answer);