const { generateSineSignal, generateStateSignal } = require('./iot-device');
const { getRandomNumber, getTimestampInSeconds } = require('./utils');
const { transmitSignal } = require('./transmitter-service');


const anomalyTimeFrame = [1, 6];
let anomalyInterval = getRandomNumber(...anomalyTimeFrame);
let startTimestamp = getTimestampInSeconds();
console.log(`############ NEW ANOMALY INTERVAL = ${anomalyInterval} ############`);

const interval = setInterval(function () {
    let sineSignal = generateSineSignal();
    let stateSignal = generateStateSignal();

    currTimestamp = getTimestampInSeconds();
    if (currTimestamp - startTimestamp >= anomalyInterval) {
        anomalyInterval = getRandomNumber(...anomalyTimeFrame);
        startTimestamp = currTimestamp;
        console.log(`############ NEW ANOMALY INTERVAL = ${anomalyInterval} ############`);
        sineSignal = getRandomNumber(32, 42);
        stateSignal = getRandomNumber(4095, 5000);
    }

    console.log(`sine = ${sineSignal}; state = ${stateSignal}`);

    // transmitSignal({ 'timestamp': 12341234, 'value': sineSignal, 'type': 'Sine' });
}, 2);

// clearInterval(interval);