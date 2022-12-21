using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace IoTMonitorServer.Models
{
    public class IoTSignal
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Timestamp")]
        public long Timestamp { get; set; }

        public int Value { get; set; }

        public string Type { get; set; } = null!;
    }
}
