using Microsoft.AspNetCore.Mvc;
using IoTMonitorServer.Services;
using IoTMonitorServer.Models;
using System.Drawing;
using System.Timers;

namespace IoTMonitorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IoTSignalsController : Controller
    {
        private readonly IoTSignalsService _iotSignalsService;
        private Dictionary<string, int[]> bounds = new Dictionary<string, int[]>()
        {
            { "Sine", new int[] { 0, 32 } },
            {  "State", new int[] { 256, 4095 } }
        };

        public IoTSignalsController(IoTSignalsService iotSignalsService) =>
            _iotSignalsService = iotSignalsService;

        [HttpGet]
        public async Task<List<IoTSignal>> Get() =>
            await _iotSignalsService.GetAsync(100);


        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<IoTSignal>> Get(string id)
        {
            var iotSignal = await _iotSignalsService.GetAsync(id);

            if (iotSignal is null)
            {
                return NotFound();
            }

            return iotSignal;
        }

        [HttpPost]
        public async Task<IActionResult> Post(IoTTransmission ioTTransmission)            
        {
            DateTimeOffset now = (DateTimeOffset)DateTime.UtcNow;
            // long currentTimestamp = now.ToUnixTimeSeconds();
            long currentTimestamp = now.ToUnixTimeMilliseconds();

            //IoTSignal sineIoTSignal = new SineIoTSignal();
            //sineIoTSignal.Timestamp = currentTimestamp;
            //sineIoTSignal.Value = ioTTransmission.Sine;

            //IoTSignal stateIoTSignal = new StateIoTSignal();
            //stateIoTSignal.Timestamp = currentTimestamp;
            //stateIoTSignal.Value = ioTTransmission.State;

            IoTSignal sineIoTSignal = new IoTSignal();
            sineIoTSignal.timestamp = currentTimestamp;
            sineIoTSignal.type = "Sine";
            sineIoTSignal.value = ioTTransmission.Sine;

            if (sineIoTSignal.value < this.bounds["Sine"][0] || sineIoTSignal.value > this.bounds["Sine"][1])
            {
                Console.WriteLine("Out of Bounds");
            }

            IoTSignal stateIoTSignal = new IoTSignal();
            stateIoTSignal.timestamp = currentTimestamp;
            stateIoTSignal.type = "State";
            stateIoTSignal.value = ioTTransmission.State;

            if (stateIoTSignal.value < this.bounds["State"][0] || stateIoTSignal.value > this.bounds["State"][1])
            {
                Console.WriteLine("Out of Bounds");
            }

            IoTSignal[] newSignals = new IoTSignal[] { sineIoTSignal, stateIoTSignal };

            await _iotSignalsService.CreateManyAsync(newSignals);

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
