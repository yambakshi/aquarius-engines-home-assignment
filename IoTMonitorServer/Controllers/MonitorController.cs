using Microsoft.AspNetCore.Mvc;
using IoTMonitorServer.Services;
using IoTMonitorServer.Models;

namespace IoTMonitorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitorController : Controller
    {
        private readonly MonitorService _monitorService;
        private readonly AlarmsService _alarmsService;
        private Dictionary<string, int[]> bounds = new Dictionary<string, int[]>()
        {
            { "Sine", new int[] { 0, 32 } },
            {  "State", new int[] { 256, 4095 } }
        };

        public MonitorController(MonitorService monitorService, AlarmsService alarmsService)
        {
            _monitorService = monitorService;
            _alarmsService = alarmsService;
        }   

        [HttpGet] // GET /api/iotsignals?limit=100
        public async Task<List<MonitorIoTSignal>> Get([FromQuery(Name = "limit")] int? limit)
        {
            var iotSignals = await _monitorService.GetRecentAsync(limit);
            return iotSignals;
        }

        [HttpPost]
        public async Task<IActionResult> Post(IoTTransmission ioTTransmission)            
        {
            DateTimeOffset now = (DateTimeOffset)DateTime.UtcNow;
            long currentTimestamp = now.ToUnixTimeMilliseconds();

            //IoTSignal sineIoTSignal = new SineIoTSignal();
            //sineIoTSignal.Timestamp = currentTimestamp;
            //sineIoTSignal.Value = ioTTransmission.Sine;

            //IoTSignal stateIoTSignal = new StateIoTSignal();
            //stateIoTSignal.Timestamp = currentTimestamp;
            //stateIoTSignal.Value = ioTTransmission.State;

            List<BaseIoTSignal> alarms = new List<BaseIoTSignal>();

            MonitorIoTSignal sineIoTSignal = new MonitorIoTSignal();
            sineIoTSignal.timestamp = currentTimestamp;
            sineIoTSignal.type = "Sine";
            sineIoTSignal.value = ioTTransmission.Sine;

            if (sineIoTSignal.value < this.bounds["Sine"][0] || sineIoTSignal.value > this.bounds["Sine"][1])
            {
                BaseIoTSignal sineIoTSignalAlarm = new BaseIoTSignal();
                sineIoTSignalAlarm.timestamp = sineIoTSignal.timestamp;
                sineIoTSignalAlarm.type = sineIoTSignal.type;
                sineIoTSignalAlarm.value = sineIoTSignal.value;
                alarms.Add(sineIoTSignalAlarm);

                sineIoTSignal.flag = "out_of_bounds";
            }

            MonitorIoTSignal stateIoTSignal = new MonitorIoTSignal();
            stateIoTSignal.timestamp = currentTimestamp;
            stateIoTSignal.type = "State";
            stateIoTSignal.value = ioTTransmission.State;

            if (stateIoTSignal.value < this.bounds["State"][0] || stateIoTSignal.value > this.bounds["State"][1])
            {
                BaseIoTSignal stateIoTSignalAlarm = new BaseIoTSignal();
                stateIoTSignalAlarm.timestamp = stateIoTSignal.timestamp;
                stateIoTSignalAlarm.type = stateIoTSignal.type;
                stateIoTSignalAlarm.value = stateIoTSignal.value;
                alarms.Add(stateIoTSignalAlarm);

                stateIoTSignal.flag = "out_of_bounds";
            }

            MonitorIoTSignal[] newSignals = new MonitorIoTSignal[] { sineIoTSignal, stateIoTSignal };

            await _monitorService.CreateManyAsync(newSignals);

            if (alarms.Count > 0)
            {
                await _alarmsService.CreateManyAsync(alarms.ToArray());
            }

            return CreatedAtAction(nameof(Get),
                new
                {
                    sineId = sineIoTSignal.Id,
                    stateId = stateIoTSignal.Id
                },
                new { sineIoTSignal, stateIoTSignal });
        }
    }
}
