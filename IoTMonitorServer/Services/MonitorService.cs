using IoTMonitorServer.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace IoTMonitorServer.Services
{
    public class MonitorService
    {
        private readonly IMongoCollection<MonitorIoTSignalModel> _monitorCollection;

        public MonitorService(IOptions<IoTMonitorDatabaseSettings> ioTMonitorDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                ioTMonitorDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ioTMonitorDatabaseSettings.Value.DatabaseName);

            _monitorCollection = mongoDatabase.GetCollection<MonitorIoTSignalModel>(
                ioTMonitorDatabaseSettings.Value.MonitorCollectionName);
        }

        public async Task<List<MonitorIoTSignalModel>> GetRecentAsync(int? limit = null)
        {
            var results = await _monitorCollection
                .Find(_ => true)
                .Sort("{timestamp: -1}")
                .Limit(limit).ToListAsync();

            return results;
        }

        public async Task CreateManyAsync(MonitorIoTSignalModel[] newSignals) =>
            await _monitorCollection.InsertManyAsync(newSignals);

        public async Task RemoveAllBeforeAsync(long timestamp) =>
            await _monitorCollection.DeleteManyAsync("{ timestamp: { $lt: " + timestamp + " } }");

    }
}
