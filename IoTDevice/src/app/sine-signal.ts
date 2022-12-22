import { BaseSignal } from "./base-signal";

export class SineSignal extends BaseSignal {
    bounds: number[] = [0, 32];

    constructor(startTimestamp: number) {
        super(startTimestamp);
    }

    calcSignal(): number {
        const signal = 15;
        return signal;
    }
}