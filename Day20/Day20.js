import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day20/Day20.txt';

const LIGHT_PIXEL = '#';
const DARK_PIXEL = '.';

const readData = () => {
    const [algo, image] = readDataIntoArray(FILE_NAME, false, '\n\n');

    const imageGrid = image.split('\n').map((row) => row.split(''));

    return {
        algo,
        imageGrid
    };
}

const getPixel = (grid, rowIndex, columnIndex, algorithm, infinitePixel) => {
    let pixelString = '';
    for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
        for (let j = columnIndex - 1; j <= columnIndex + 1; j++) {
            pixelString += grid[i] && grid[i][j] ? grid[i][j] : infinitePixel;
        }
    }
    const binaryString = pixelString.split('').map((pixel) => pixel === DARK_PIXEL ? 0 : 1).join('');
    const decimalNumber = parseInt(binaryString, 2);

    return algorithm.charAt(decimalNumber);
}

const enhanceImage = (imageGrid, algo, infinitePixel) => {
    let grid = []
    for (let i = -1; i < imageGrid.length + 1; i++) {
        let row = [];
        for (let j = -1; j < imageGrid[0].length + 1; j++) {
            row.push(getPixel(imageGrid, i, j, algo, infinitePixel));
        }
        grid.push(row);
    }
    return grid;
}

const enhanceImageTimes = (imageGrid, algo, times) => {
    let gridToEnhance = imageGrid;
    let defaultPixel = DARK_PIXEL;
    for (let i = 0; i < times; i++) {
        gridToEnhance = enhanceImage(gridToEnhance, algo, defaultPixel);

        const binaryDefaultPixelString = defaultPixel.repeat(9).split('').map((pixel) => pixel === DARK_PIXEL ? 0 : 1).join('');
        defaultPixel = algo.charAt(parseInt(binaryDefaultPixelString, 2));
    }
    
    return countNumberOfLightPixels(gridToEnhance);
}

const countNumberOfLightPixels = (imageGrid) => 
    imageGrid.reduce((accum, row) => accum += row.filter((pixel) => pixel === LIGHT_PIXEL).length, 0);

const {imageGrid, algo} = readData();
const part1Answer = enhanceImageTimes(imageGrid, algo, 2);
console.log('part1Answer', part1Answer);
const part2Answer = enhanceImageTimes(imageGrid, algo, 50);
console.log('part2Answer', part2Answer);
// 21581 is too high