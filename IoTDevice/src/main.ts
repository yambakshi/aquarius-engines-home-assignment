import { logger } from './config';
import { Transmitter } from './app/transmitter';

function main(): void {
    try {
        const transmitter = new Transmitter();
        const interval = setInterval(() => {
            transmitter.transmitSignals();
        }, 2);
    } catch (err: any) {
        logger.error({ message: err.message, label: 'main' });
        return null;
    }
}

main();