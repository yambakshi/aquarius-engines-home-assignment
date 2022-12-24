﻿namespace IoTMonitorServer.Models
{
    public class IoTMonitorDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string MonitorCollectionName { get; set; } = null!;

        public string AlarmsCollectionName { get; set; } = null!;
    }
}
