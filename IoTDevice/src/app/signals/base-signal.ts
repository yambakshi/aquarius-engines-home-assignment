import { logger } from '../../config';

export class BaseSignal {
    readonly anomalyTimeframe: number[] = [1, 6];
    value: number;
    anomaly: { timestamp: number, interval: number };
    bounds: number[];

    constructor(startTimestamp: number) {
        this.anomaly = {
            timestamp: startTimestamp,
            interval: this.generateAnomalyInterval()
        }
    }

    generateSignal(currTimestamp: number): void {
        const { timestamp, interval } = this.anomaly;

        // If it is not yet the time for an anomaly
        if (currTimestamp - timestamp < interval) {
            this.value = this.calcSignal();
            return;
        }

        // Generate an anomaly
        this.anomaly.interval = this.generateAnomalyInterval();
        this.anomaly.timestamp = currTimestamp;
        this.value = this.getRandomNumberInRange([this.bounds[1], this.bounds[1] * 1.2]);
    }

    protected calcSignal(): number {
        const signal = this.getRandomNumberInRange(this.bounds);
        return signal;
    }

    private getRandomNumberInRange(bounds: number[]): number {
        const ceil = Math.ceil(bounds[0]);
        const floor = Math.floor(bounds[1]);
        return Math.floor(Math.random() * (ceil - floor + 1)) + floor;
    }

    private generateAnomalyInterval(): number {
        const anomalyInterval = this.getRandomNumberInRange(this.anomalyTimeframe);
        logger.info({ message: `New anomaly interval = '${anomalyInterval}' for '${this.constructor.name}'`, label: 'generateAnomaly' });

        return anomalyInterval;
    }
}