using IoTMonitorServer.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace IoTMonitorServer.Services
{
    public class AlarmsService
    {

        private readonly IMongoCollection<BaseIoTSignalModel> _alarmsCollection;

        public AlarmsService(IOptions<IoTMonitorDatabaseSettings> ioTMonitorDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                ioTMonitorDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ioTMonitorDatabaseSettings.Value.DatabaseName);

            _alarmsCollection = mongoDatabase.GetCollection<BaseIoTSignalModel>(
                ioTMonitorDatabaseSettings.Value.AlarmsCollectionName);
        }

        public async Task<List<BaseIoTSignalModel>> GetAsync() =>
            await _alarmsCollection.Find(_ => true).ToListAsync();

        public async Task CreateManyAsync(BaseIoTSignalModel[] newSignals) =>
            await _alarmsCollection.InsertManyAsync(newSignals);
    }
}
