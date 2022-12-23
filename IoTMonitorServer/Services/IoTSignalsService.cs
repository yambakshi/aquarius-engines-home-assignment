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

        public async Task<List<IoTSignal>> GetAsync() =>
            await _signalsCollection.Find(_ => true).ToListAsync();

        public async Task<List<IoTSignal>> GetAlarmsAsync() =>
            await _signalsCollection.Find(x => x.flag != null).ToListAsync();

        public async Task<List<IoTSignal>> GetAsync(int n) =>
            await _signalsCollection.Find(_ => true).Limit(n).ToListAsync();

        public async Task<IoTSignal?> GetAsync(string id) =>
            await _signalsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

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
