import {readDataIntoArray} from "../utils/readDataIntoArray.js";

const FILE_NAME = './Day16/Day16.txt';

const convertHexToBinaryString = (hex) =>
    hex.split('').map((hexDigit) => parseInt(hexDigit, 16).toString(2).padStart(4, '0')).join('')

const convertBinaryToDecimal = (binary) => parseInt(binary, 2);

const computeValue = (typeId, packets) => {
    switch (typeId) {
        case 0:
            return packets.reduce((accum, packet) => accum += packet.value, 0);
        case 1:
            return packets.reduce((accum, packet) => accum *= packet.value, 1);
        case 2:
            return Math.min(...packets.map((packet) => packet.value));
        case 3:
            return Math.max(...packets.map((packet) => packet.value));
        case 5:
            if(packets.length !== 2) {
                console.log('error');
            }
            return packets[0].value > packets[1].value ? 1 : 0
        case 6:
            if(packets.length !== 2) {
                console.log('error');
            }
            return packets[0].value < packets[1].value ? 1 : 0
        case 7:
            if(packets.length !== 2) {
                console.log('error');
            }
            return packets[0].value === packets[1].value ? 1 : 0

    }

}

const parsePacket = (binaryString) => {
    const version = convertBinaryToDecimal(binaryString.substring(0, 3));
    const typeId = convertBinaryToDecimal(binaryString.substring(3, 6));

    if (typeId === 4) {
        let value = 0;
        let nextStringStartingIndex = 6;
        let canContinue = true;
        while (canContinue) {
            value += binaryString.substring(nextStringStartingIndex + 1, nextStringStartingIndex + 5);
            canContinue = binaryString.substring(nextStringStartingIndex, nextStringStartingIndex + 1) === '1';
            nextStringStartingIndex += 5;
        }

        return {
            version,
            typeId,
            value: convertBinaryToDecimal(value),
            totalLength: nextStringStartingIndex
        };
    }

    const lengthTypeId = convertBinaryToDecimal(binaryString.substring(6, 7));

    let offset = lengthTypeId === 0 ? 22 : 18;
    const length = lengthTypeId === 0 ? convertBinaryToDecimal(binaryString.substring(7, offset)) : convertBinaryToDecimal(binaryString.substring(7, offset));

    let packets = [];
    let totalLength = 0;
    while (lengthTypeId === 0 && totalLength < length || lengthTypeId === 1 && packets.length < length) {
        const parsedPacket = parsePacket(binaryString.substring(offset));

        packets.push(parsedPacket);
        totalLength += parsedPacket.totalLength;
        offset += parsedPacket.totalLength;
    }

    const value = computeValue(typeId, packets);
    return {
        version,
        typeId,
        packets,
        totalLength: offset,
        value
    }
}

const computeVersionSum = (allPackets) => {
    if (!allPackets || !allPackets.length) {
        return 0;
    }

    return allPackets.reduce((accum, packet) => accum += packet.version + computeVersionSum(packet.packets), 0)
}

const fullPacket = readDataIntoArray(FILE_NAME, false, '\n')[0];
const allPackets = parsePacket(convertHexToBinaryString(fullPacket))
const part1Answer = computeVersionSum([allPackets]);
console.log('part1Answer', part1Answer);
const part2Answer = allPackets.value;
console.log('part2Answer', part2Answer);
