import { BaseSignal } from "./base-signal";

export class SineSignal extends BaseSignal {
    bounds: number[] = [0, 32];
    amplitude: number = 40;
    frequency: number = 20;
    x: number = 0;
    y: number = 0;
    signal: number = -1;
    shouldIncrement: boolean = true;

    constructor(startTimestamp: number) {
        super(startTimestamp);
    }

    calcSignal(): number {
        if (this.shouldIncrement && this.signal < this.bounds[1]) {
            this.signal++;
        } else if (this.signal > this.bounds[0]) {
            this.shouldIncrement = false;
            this.signal--;
        } else {
            this.shouldIncrement = true;
            this.signal++;
        }

        return this.signal;
    }
}