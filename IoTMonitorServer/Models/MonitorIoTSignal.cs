using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace IoTMonitorServer.Models
{
    public class MonitorIoTSignal : BaseIoTSignal
    {   
        public string flag { get; set; } = null!;
    }
}