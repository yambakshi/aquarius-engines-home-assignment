namespace IoTMonitorServer.Models
{
    public class StateIoTSignal : IoTSignal
    {
        private int[] bounds = new int[] { 256, 4095 };
        //public StateIoTSignal(long Timestamp, int Value)
        //{
        //    this.Type = "State";
        //    this.Timestamp = Timestamp;
        //    this.Value = Value;

        //    if (Value < this.bounds[0] || Value > this.bounds[1]) {
        //        this.Flag = "Out of bounds";
        //    }
        //}
    }
}
