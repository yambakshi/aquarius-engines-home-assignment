import { logger } from '../config';
import { sendTransmission } from './send-transmission';
import { SignalType } from './enums/signal-type.enum';
import { StateSignal } from './state-signal';
import { SineSignal } from './sine-signal';

export class Transmitter {
    private sineSignal: SineSignal;
    private stateSignal: StateSignal;

    constructor() {
        const currTimestamp = this.getTimestampInSeconds();
        this.sineSignal = new SineSignal(currTimestamp);
        this.stateSignal = new StateSignal(currTimestamp);
    }

    transmitSignals(): void {
        const currTimestamp = this.getTimestampInSeconds();
        this.sineSignal.generateSignal(currTimestamp);
        this.stateSignal.generateSignal(currTimestamp);

        logger.info({ message: `Transmitting: sine = ${this.sineSignal.value}; state = ${this.stateSignal.value}`, label: 'transmitSignals' });

        sendTransmission({
            [SignalType.Sine]: this.sineSignal.value,
            [SignalType.State]: this.stateSignal.value
        });
    }

    private getTimestampInSeconds(): number {
        return Math.floor(Date.now() / 1000);
    }
}