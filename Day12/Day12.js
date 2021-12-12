import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day12/Day12.txt';

const createCaveMap = () => {
    const paths = readDataIntoArray(FILE_NAME, false, '\n');

    return paths.reduce((accum, path) => {
        const [start, end] = path.split('-');

        if (accum[start] && end !== 'start') {
            accum[start].nextCaves.push(end);
        } else if(end !== 'start') {
            accum[start] = {
                nextCaves: [end]
            }
        }

        if (accum[end] && start !== 'start') {
            accum[end].nextCaves.push(start);
        } else if (start !== 'start') {
            accum[end] = {
                nextCaves: [start],
                hasVisited: false
            }
        }

        return accum;

    }, {})
}

const findAllRoutesThroughCave = (caveMap, startingPoint, path = '', hasUsedRepeat) => {
    path += startingPoint + ','
    if (startingPoint === 'end') {
        return [{
            path,
            isValid: true,
            hasUsedRepeat
        }];
    }

    if (startingPoint.charAt(0) === startingPoint.charAt(0).toLowerCase() && caveMap[startingPoint].hasVisited) {
        if(hasUsedRepeat) {
            return [{
                path,
                isValid: false,
                hasUsedRepeat
            }];
        }

        if(startingPoint !== 'start') {
            hasUsedRepeat = true;
        }
    }

    caveMap[startingPoint].hasVisited = true;

    return caveMap[startingPoint].nextCaves.reduce((accum, nextPoint) => {
        const result = findAllRoutesThroughCave(JSON.parse(JSON.stringify(caveMap)), nextPoint, path, hasUsedRepeat);
        accum.push(...result.filter((result) => result.isValid))

        return accum;
    }, []);
}

const map = createCaveMap();
const part1Answer = findAllRoutesThroughCave(map, 'start', '', true).length;
console.log('part1Answer', part1Answer);
const part2Answer = findAllRoutesThroughCave(map, 'start', '', false).length;
console.log('part2Answer', part2Answer);