import { IoTSignalType } from "app/enums/iot-signal-type.enum";

export class BaseIoTSignal {
    _id: string;
    timestamp: number;
    value: number;
    type: IoTSignalType;

    constructor(baseIotSignal?: BaseIoTSignal) {
        if (!baseIotSignal) return;
        this.timestamp = baseIotSignal.timestamp;
        this.value = baseIotSignal.value;
        this.type = baseIotSignal.type;
    }
}