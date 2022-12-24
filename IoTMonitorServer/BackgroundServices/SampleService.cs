using IoTMonitorServer.Services;
using Microsoft.AspNetCore.SignalR;
using SignalRChat.Hubs;

namespace IoTMonitorServer.BackgroundServices
{
    public class SampleService
    {
        private readonly ILogger<SampleService> _logger;
        private readonly MonitorService _monitorService;
        private readonly IHubContext<IoTSignalsHub> _hubContext;

        public SampleService(
            ILogger<SampleService> logger,
            MonitorService monitorService,
            IHubContext<IoTSignalsHub> hubContext)
        {
            _logger = logger;
            _monitorService = monitorService;
            _hubContext = hubContext;
        }

        public async Task DoSomethingAsync()
        {
            await Task.Delay(100);
            var iotSignals = await _monitorService.GetRecentAsync(1000);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", iotSignals);
            _logger.LogInformation(
                "Sample Service did something.");
        }
    }
}
