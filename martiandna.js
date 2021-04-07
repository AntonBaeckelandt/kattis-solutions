const {
    constants
} = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lineIndex = 0;
let cumulativeObject = {
    'nucleobases': [],
};

rl.on('line', (line) => {
    parseLine(line);
    if (cumulativeObject['R'] && cumulativeObject['R'] + 1 == lineIndex) {
        const result = calculateResult(cumulativeObject);
        console.log(result ? result : 'impossible');
    }
    lineIndex++;
});

function parseLine(line) {
    if (lineIndex == 0) {
        cumulativeObject = parseLineOne(line, cumulativeObject);
    } else if (lineIndex == 1) {
        cumulativeObject = parseLineTwo(line, cumulativeObject);
    } else {
        cumulativeObject = parseLineN(line, cumulativeObject);
    }
}

function parseLineOne(line, cumulativeObject) {
    const numbers = line.split(' ');
    cumulativeObject['N'] = parseInt(numbers[0]);
    cumulativeObject['K'] = parseInt(numbers[1]);
    cumulativeObject['R'] = parseInt(numbers[2]);
    return cumulativeObject;
}

function parseLineTwo(line, cumulativeObject) {
    cumulativeObject['DNA'] = line;
    return cumulativeObject;
}

function parseLineN(line, cumulativeObject) {
    const numbers = line.split(' ');
    const nucleobase = {
        'B': parseInt(numbers[0]),
        'Q': parseInt(numbers[1]),
    };
    cumulativeObject['nucleobases'].push(nucleobase);
    return cumulativeObject;
}

function calculateResult(data) {
    let lowestFound = null;
    const minSubstringLength = data['nucleobases'].reduce((acc, curr) => acc + curr['Q'], 0); // Sum of all quantities
    const nucleobasesFromDna = data['DNA'].split(' ');

    for (let i = 0; i < data['N'] - minSubstringLength + 1; i++) { // i = startpos
        const maxLength = data['N'] + 1;
        for (let j = i + minSubstringLength; j < maxLength; j++) { // j = endpos
            const dnaSequence = nucleobasesFromDna.slice(i, j);
            const valid = isSubstringValid(data, dnaSequence);
            if ((valid && lowestFound != null && dnaSequence.length < lowestFound) || valid && !lowestFound) {
                lowestFound = dnaSequence.length;
            }
        }
    }
    return lowestFound;
}

function isSubstringValid(data, dnaSequence) {
    let valid = true;

    for (let baseToCheck of data['nucleobases']) {
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v == val ? a + 1 : a), 0);
        const countInSequence = countOccurrences(dnaSequence, baseToCheck['B']);
        const minRequiredQuantity = baseToCheck['Q'];
        if (countInSequence < minRequiredQuantity) {
            valid = false;
            break;
        }
    }
    return valid;
}