import { logger } from './config';
import { Transmitter } from './app/transmitter';

function main(): void {
    const transmitter = new Transmitter();
    const interval = setInterval(() => {
        try {
            transmitter.transmitSignals();
        } catch (err: any) {
            logger.error({ message: err.message, label: 'main' });
            return null;
        }
    }, 2);
}

main();