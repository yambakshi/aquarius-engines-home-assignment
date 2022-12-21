import { logger } from './config';
import { generateSineSignal, generateStateSignal } from './app/signals-generator';
import { getRandomNumber, getTimestampInSeconds } from './app/utils';
import { transmitSignal } from './app/transmitter-service';


const anomalyTimeFrame = [1, 6] as const;
let anomalyInterval = getRandomNumber(...anomalyTimeFrame);
let startTimestamp = getTimestampInSeconds();
logger.info({ message: `New anomaly interval = ${anomalyInterval}`, label: 'main' });

const interval = setInterval(() => {
    let sineSignal = generateSineSignal();
    let stateSignal = generateStateSignal();

    const currTimestamp = getTimestampInSeconds();
    if (currTimestamp - startTimestamp >= anomalyInterval) {
        anomalyInterval = getRandomNumber(...anomalyTimeFrame);
        startTimestamp = currTimestamp;
        logger.info({ message: `New anomaly interval = ${anomalyInterval}`, label: 'main' });
        sineSignal = getRandomNumber(32, 42);
        stateSignal = getRandomNumber(4095, 5000);
    }

    logger.info({ message: `Transmitting: sine = ${sineSignal}; state = ${stateSignal}`, label: 'main' });

    transmitSignal({ 'Sine': sineSignal, 'State': stateSignal });
}, 2);