import { BaseSignal } from "./base-signal";

export class StateSignal extends BaseSignal {
    bounds: number[] = [256, 4095];

    constructor(startTimestamp: number) {
        super(startTimestamp);
    }
}