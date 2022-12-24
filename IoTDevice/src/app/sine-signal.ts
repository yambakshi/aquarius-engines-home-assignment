import { BaseSignal } from "./base-signal";

export class SineSignal extends BaseSignal {
    bounds: number[] = [0, 32];
    signal: number = 0;
    increment: number = 12.8;
    shouldIncrement: boolean = true;

    constructor(startTimestamp: number) {
        super(startTimestamp);
    }

    private incrementSignal(increment: number): number {
        const newSignal = parseFloat((this.signal + increment).toFixed(2));
        if (newSignal > this.bounds[1]) {
            return this.bounds[1];
        } else if (newSignal < this.bounds[0]) {
            return this.bounds[0];
        } else return newSignal;
    }

    calcSignal(): number {
        const signal = this.signal;

        // If the sine wave has yet to reach the amplitube peak
        if (this.shouldIncrement && this.signal < this.bounds[1]) {
            this.signal = this.incrementSignal(this.increment);
        } else if (this.signal > this.bounds[0]) { // If the sine wave has yet to reach the amplitube valey
            this.shouldIncrement = false;
            this.signal = this.incrementSignal(-this.increment);
        } else { // If the sine wave has reached the amplitube valey
            this.shouldIncrement = true;
            this.signal = this.incrementSignal(this.increment);
        }

        return signal;
    }
}