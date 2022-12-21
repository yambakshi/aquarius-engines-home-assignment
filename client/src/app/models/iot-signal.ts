import { IoTSignalType } from "app/enums/iot-signal-type.enum";

export class IoTSignal {
    _id: string;
    timestamp: string;
    value: number;
    type: IoTSignalType;

    constructor(iotSignal?: IoTSignal) {
        if (!iotSignal) return;
        this.timestamp = iotSignal.timestamp;
        this.value = iotSignal.value;
        this.type = iotSignal.type;
    }
}