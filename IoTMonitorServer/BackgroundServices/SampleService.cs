using IoTMonitorServer.Services;
using Microsoft.AspNetCore.SignalR;
using SignalRChat.Hubs;

namespace IoTMonitorServer.BackgroundServices
{
    public class SampleService
    {
        private readonly ILogger<SampleService> _logger;
        private readonly IoTSignalsService _iotSignalsService;
        private readonly IHubContext<IoTSignalsHub> _hubContext;

        public SampleService(
            ILogger<SampleService> logger,
            IoTSignalsService iotSignalsService,
            IHubContext<IoTSignalsHub> hubContext)
        {
            _logger = logger;
            _iotSignalsService = iotSignalsService;
            _hubContext = hubContext;
        }

        public async Task DoSomethingAsync()
        {
            await Task.Delay(100);
            var iotSignals = await _iotSignalsService.GetAsync(100);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", iotSignals);
            _logger.LogInformation(
                "Sample Service did something.");
        }
    }
}
