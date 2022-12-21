const { getRandomNumber } = require('./utils');

function generateSineSignal() {
    const signal = getRandomNumber(0, 32);
    return signal;
}

function generateStateSignal() {
    const signal = getRandomNumber(256, 4095);
    return signal;
}

module.exports = {
    generateSineSignal,
    generateStateSignal
}