using Microsoft.AspNetCore.Mvc;
using IoTMonitorServer.Services;
using IoTMonitorServer.Models;

namespace IoTMonitorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlarmsController : Controller
    {
        private readonly AlarmsService _alarmsService;

        public AlarmsController(MonitorService monitorService, AlarmsService alarmsService)
        {
            _alarmsService = alarmsService;
        }

        [HttpGet]
        public async Task<List<BaseIoTSignal>> Get() =>
            await _alarmsService.GetAsync();
    }
}
