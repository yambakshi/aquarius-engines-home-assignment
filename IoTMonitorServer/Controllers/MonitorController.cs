using Microsoft.AspNetCore.Mvc;
using IoTMonitorServer.Services;
using IoTMonitorServer.Models;
using IoTMonitorServer.Enums;

namespace IoTMonitorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitorController : Controller
    {
        private readonly MonitorService _monitorService;
        private readonly AlarmsService _alarmsService;
        private readonly Dictionary<IoTSignalType, int[]> _bounds = new Dictionary<IoTSignalType, int[]>()
        {
            { IoTSignalType.Sine, new int[] { 0, 32 } },
            {  IoTSignalType.State, new int[] { 256, 4095 } }
        };

        public MonitorController(MonitorService monitorService, AlarmsService alarmsService)
        {
            _monitorService = monitorService;
            _alarmsService = alarmsService;
        }   

        [HttpGet] // GET /api/iotsignals?limit=100
        public async Task<List<MonitorIoTSignalModel>> Get([FromQuery(Name = "limit")] int? limit)
        {
            var iotSignals = await _monitorService.GetRecentAsync(limit);
            return iotSignals;
        }

        [HttpPost]
        public async Task<IActionResult> Post(IoTTransmission ioTTransmission)            
        {
            DateTimeOffset now = (DateTimeOffset)DateTime.UtcNow;
            long currentTimestamp = now.ToUnixTimeMilliseconds();
            List<BaseIoTSignalModel> alarms = new List<BaseIoTSignalModel>();
            Dictionary<IoTSignalType, TransmissionIoTSignal> monitorIoTSignals = new Dictionary<IoTSignalType, TransmissionIoTSignal>() {
                { IoTSignalType.Sine, new TransmissionIoTSignal(currentTimestamp, IoTSignalType.Sine, ioTTransmission.Sine) },
                { IoTSignalType.State, new TransmissionIoTSignal(currentTimestamp, IoTSignalType.State, ioTTransmission.State) }
            };

            foreach (var monitorIotSignal in monitorIoTSignals)
            {
                BaseIoTSignalModel alarmIoTSignal = monitorIotSignal.Value.validateIoTSignal(_bounds[monitorIotSignal.Key]);
                if (alarmIoTSignal != null)
                {
                    alarms.Add(alarmIoTSignal);
                }
            }

            MonitorIoTSignalModel[] newSignals = new MonitorIoTSignalModel[] { 
                monitorIoTSignals[IoTSignalType.Sine].ioTSignal,
                monitorIoTSignals[IoTSignalType.State].ioTSignal
            };

            await _monitorService.CreateManyAsync(newSignals);

            if (alarms.Count > 0)
            {
                await _alarmsService.CreateManyAsync(alarms.ToArray());
            }

            return CreatedAtAction(nameof(Get),
                new
                {
                    sineId = monitorIoTSignals[IoTSignalType.Sine].ioTSignal.Id,
                    stateId = monitorIoTSignals[IoTSignalType.State].ioTSignal.Id
                },
                new {
                    sineIoTSignal= monitorIoTSignals[IoTSignalType.Sine].ioTSignal,
                    stateIoTSignal= monitorIoTSignals[IoTSignalType.State].ioTSignal
                });
        }
    }
}
