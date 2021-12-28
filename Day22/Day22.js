import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day22/Day22Sample.txt';

const initializationZone = {
    x: [-50, 50],
    y: [-50, 50],
    z: [-50, 50]
};

const readSteps = () => {
    const steps = readDataIntoArray(FILE_NAME, false, '\n');

    return steps.map((step) => {
        const [state, dimensions] = step.split(' ');

        const ranges = dimensions.split(',');

        return ranges.reduce((accum, rangeString) => {
            const [coord, fullRange] = rangeString.split('=');

            return {
                ...accum,
                [coord]: [Number(fullRange.split('..')[0]), Number(fullRange.split('..')[1])]
            }
        }, {state})
    })
}

const initializeCube = () => {
    const cube = {};
    for (let x = initializationZone.x[0]; x <= initializationZone.x[1]; x++) {
        for (let y = initializationZone.y[0]; y <= initializationZone.y[1]; y++) {
            for (let z = initializationZone.z[0]; z <= initializationZone.z[1]; z++) {
                cube[`${x},${y},${z}`] = 'off'
            }
        }
    }
    return cube;
}

const runSteps = (cube, steps) => {
    steps.forEach((step) => {
        for(let x = step.x[0]; x<=step.x[1]; x++) {
            for(let y = step.y[0]; y <= step.y[1]; y++) {
                for(let z = step.z[0]; z<= step.z[1]; z++) {
                    cube[`${x},${y},${z}`] = step.state
                }
            }
        }
    });
    
    return Object.values(cube).filter((state) => state === 'on').length
}

const steps = readSteps();
const initialCube = initializeCube();
const part1Answer = runSteps(initialCube, steps);
console.log('part1Answer', part1Answer);
