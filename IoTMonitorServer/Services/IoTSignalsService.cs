using IoTMonitorServer.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace IoTMonitorServer.Services
{
    public class IoTSignalsService
    {

        private readonly IMongoCollection<IoTSignal> _signalsCollection;

        public IoTSignalsService(IOptions<IoTMonitorDatabaseSettings> ioTMonitorDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                ioTMonitorDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ioTMonitorDatabaseSettings.Value.DatabaseName);

            _signalsCollection = mongoDatabase.GetCollection<IoTSignal>(
                ioTMonitorDatabaseSettings.Value.IoTSignalsCollectionName);
        }

        public async Task<List<IoTSignal>> GetAsync(string? flag, int? limit)
        {
            var results = await _signalsCollection.Find(x => x.flag == flag).Limit(limit).ToListAsync();
            return results;
        }

        public async Task CreateAsync(IoTSignal newSignal) =>
            await _signalsCollection.InsertOneAsync(newSignal);
        public async Task CreateManyAsync(IoTSignal[] newSignals) =>
            await _signalsCollection.InsertManyAsync(newSignals);

        public async Task UpdateAsync(string id, IoTSignal updatedSignal) =>
            await _signalsCollection.ReplaceOneAsync(x => x.Id == id, updatedSignal);

        public async Task RemoveAsync(string id) =>
            await _signalsCollection.DeleteOneAsync(x => x.Id == id);

    }
}
