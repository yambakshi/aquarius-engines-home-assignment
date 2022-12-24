import { logger } from './config';
import { Transmitter } from './app/transmitter';

function main(): void {
    try {
        const transmissionRate = 2;
        const transmitter = new Transmitter(transmissionRate);
        const interval = setInterval(() => {
            transmitter.transmitSignals();
        }, transmissionRate);
    } catch (err: any) {
        logger.error({ message: err.message, label: 'main' });
        return null;
    }
}

main();