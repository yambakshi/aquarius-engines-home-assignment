using IoTMonitorServer.Enums;

namespace IoTMonitorServer.Models
{
    public class TransmissionIoTSignal
    {
        public MonitorIoTSignalModel ioTSignal;

        public TransmissionIoTSignal(long currentTimestamp, IoTSignalType type, int value) {
            ioTSignal = new MonitorIoTSignalModel();
            ioTSignal.timestamp = currentTimestamp;
            ioTSignal.type = type.ToString();
            ioTSignal.value = value;
        }

        public BaseIoTSignalModel validateIoTSignal(int[] bounds)
        {
            if (ioTSignal.value >= bounds[0] && ioTSignal.value <= bounds[1])
            {
                return null;
            }
            
            BaseIoTSignalModel alarmIoTSignal = new BaseIoTSignalModel();
            alarmIoTSignal.timestamp = ioTSignal.timestamp;
            alarmIoTSignal.type = ioTSignal.type;
            alarmIoTSignal.value = ioTSignal.value;

            ioTSignal.flag = "out_of_bounds";

            return alarmIoTSignal;
        }
    }
}
