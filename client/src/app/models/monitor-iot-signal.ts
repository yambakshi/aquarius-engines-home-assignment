import { IoTSignalFlag } from "app/enums/iot-signal-flag.enum";
import { BaseIoTSignal } from "./base-iot-signal";

export class MonitorIoTSignal extends BaseIoTSignal {
    flag: IoTSignalFlag;

    constructor(monitorIotSignal?: MonitorIoTSignal) {
        super(monitorIotSignal);

        if (!monitorIotSignal) return;
        this.flag = monitorIotSignal.flag;
    }
}