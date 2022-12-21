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
        public async Task<IActionResult> Post(IoTSignal newIoTSignal)
        {
            await _iotSignalsService.CreateAsync(newIoTSignal);

            return CreatedAtAction(nameof(Get), new { id = newIoTSignal.Id }, newIoTSignal);
        }
    }
}
