import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day21/Day21Sample.txt';

const readInput = () => {
    const [player1String, player2String] = readDataIntoArray(FILE_NAME, false, '\n');

    const player1 = Number(player1String.split(':')[1].trim());
    const player2 = Number(player2String.split(':')[1].trim());

    return {player1, player2};
}

const playGame = (player1Starting, player2Starting) => {
    let position = [player1Starting, player2Starting];
    let score = [0, 0];
    let playerTurn = 0;
    let diceRollCount = 0;

    while (score[0] < 1000 && score[1] < 1000) {
        // This counts 100 as 0, but since board is the length 10, that's net the same, so oh well
        const amountToMove = (diceRollCount + 1) % 100 + (diceRollCount + 2) % 100 + (diceRollCount + 3) % 100;
        diceRollCount += 3;

        position[playerTurn] = (position[playerTurn] + amountToMove) % 10;

        score[playerTurn] += position[playerTurn] === 0 ? 10 : position[playerTurn];

        playerTurn = playerTurn === 0 ? 1 : 0;
    }

    return Math.min(...score) * diceRollCount;
}

const possibleDiracDiceOutcomes = [
    {value: 3, frequency: 1},
    {value: 4, frequency: 3},
    {value: 5, frequency: 6},
    {value: 6, frequency: 7},
    {value: 7, frequency: 6},
    {value: 8, frequency: 3},
    {value: 9, frequency: 1},
]

const takeTurn = (player1Stat, player2Stat) => {
    if (player1Stat.isTurn) {
        return {
            player1Wins: possibleDiracDiceOutcomes.reduce((accum, roll) =>
                    accum += roll.frequency * playGameInUniverse({
                        position: (player1Stat.position + roll.value) % 10,
                        score: player1Stat.score + (player1Stat.position + roll.value) % 10,
                        isTurn: false

                    }, {
                        ...player2Stat,
                        isTurn: true
                    }).player1Wins
                , 0),
            totalWins: possibleDiracDiceOutcomes.reduce((accum, roll) =>
                    accum += roll.frequency * playGameInUniverse({
                        position: (player1Stat.position + roll.value) % 10,
                        score: player1Stat.score + (player1Stat.position + roll.value) % 10,
                        isTurn: false

                    }, {
                        ...player2Stat,
                        isTurn: true
                    }).totalWins
                , 0),
        }
    }

    return {
        player1Wins: possibleDiracDiceOutcomes.reduce((accum, roll) =>
                accum += roll.frequency * playGameInUniverse({
                    ...player1Stat,
                    isTurn: true

                }, {
                    position: (player2Stat.position + roll.value) % 10,
                    score: player2Stat.score + (player2Stat.position + roll.value) % 10,
                    isTurn: false
                }).player1Wins
            , 0),
        totalWins: possibleDiracDiceOutcomes.reduce((accum, roll) =>
                accum += roll.frequency * playGameInUniverse({
                    ...player1Stat,
                    isTurn: true

                }, {
                    position: (player2Stat.position + roll.value) % 10,
                    score: player2Stat.score + (player2Stat.position + roll.value) % 10,
                    isTurn: false
                }).totalWins
            , 0),
    }


}

const playGameInUniverse = (player1Stat, player2Stat) => {
    if (player1Stat.score >= 21) {
        return {
            player1Wins: 1,
            totalWins: 1
        }
    } else if (player2Stat.score >= 21) {
        return {
            player1Wins: 0,
            totalWins: 1
        }
    }

    return takeTurn(player1Stat, player2Stat);
}

const playGameInMultipleUniverses = (player1Starting, player2Starting) => {
    return playGameInUniverse({
        score: 0,
        position: player1Starting,
        isTurn: true
    }, {
        score: 0,
        position: player2Starting,
        isTurn: false
    });
}

const startingPositions = readInput();

const part1Answer = playGame(startingPositions.player1, startingPositions.player2);
console.log('part1Answer', part1Answer);
const part2Answer = playGameInMultipleUniverses(startingPositions.player1, startingPositions.player2);
console.log('part2Answer', part2Answer);