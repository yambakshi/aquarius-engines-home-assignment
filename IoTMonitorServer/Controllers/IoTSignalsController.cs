using Microsoft.AspNetCore.Mvc;
using IoTMonitorServer.Services;
using IoTMonitorServer.Models;

namespace IoTMonitorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IoTSignalsController : Controller
    {

        private readonly IoTSignalsService _iotSignalsService;

        public IoTSignalsController(IoTSignalsService iotSignalsService) =>
            _iotSignalsService = iotSignalsService;

        [HttpGet]
        public async Task<List<IoTSignal>> Get() =>
            await _iotSignalsService.GetAsync();


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

            IoTSignal sineIoTSignal = new IoTSignal();
            sineIoTSignal.Timestamp = currentTimestamp;
            sineIoTSignal.Type = "Sine";
            sineIoTSignal.Value = ioTTransmission.Sine;

            IoTSignal stateIoTSignal = new IoTSignal();
            stateIoTSignal.Timestamp = currentTimestamp;
            stateIoTSignal.Type = "State";
            stateIoTSignal.Value = ioTTransmission.State;

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
