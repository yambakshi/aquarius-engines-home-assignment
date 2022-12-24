using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace IoTMonitorServer.Models
{
    public class BaseIoTSignal
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("timestamp")]
        public long timestamp { get; set; }

        public int value { get; set; }

        public string type { get; set; } = null!;
    }
}
