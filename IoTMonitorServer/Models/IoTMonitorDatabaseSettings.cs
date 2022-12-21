namespace IoTMonitorServer.Models
{
    public class IoTMonitorDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string IoTSignalsCollectionName { get; set; } = null!;
    }
}
