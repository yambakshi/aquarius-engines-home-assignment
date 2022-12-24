using IoTMonitorServer.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace IoTMonitorServer.Services
{
    public class AlarmsService
    {

        private readonly IMongoCollection<BaseIoTSignal> _alarmsCollection;

        public AlarmsService(IOptions<IoTMonitorDatabaseSettings> ioTMonitorDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                ioTMonitorDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ioTMonitorDatabaseSettings.Value.DatabaseName);

            _alarmsCollection = mongoDatabase.GetCollection<BaseIoTSignal>(
                ioTMonitorDatabaseSettings.Value.AlarmsCollectionName);
        }

        public async Task<List<BaseIoTSignal>> GetAsync() =>
            await _alarmsCollection.Find(_ => true).ToListAsync();

        public async Task CreateAsync(BaseIoTSignal newSignal) =>
            await _alarmsCollection.InsertOneAsync(newSignal);

        public async Task CreateManyAsync(BaseIoTSignal[] newSignals) =>
            await _alarmsCollection.InsertManyAsync(newSignals);

        public async Task UpdateAsync(string id, BaseIoTSignal updatedSignal) =>
            await _alarmsCollection.ReplaceOneAsync(x => x.Id == id, updatedSignal);

        public async Task RemoveAsync(string id) =>
            await _alarmsCollection.DeleteOneAsync(x => x.Id == id);

    }
}
