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
        private readonly int _signalsPerSecond = 1000;

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
            var iotSignals = await _monitorService.GetAllAsync();

            if (iotSignals.Count >= _signalsPerSecond * 2)
            {
                iotSignals.RemoveRange(_signalsPerSecond, iotSignals.Count - _signalsPerSecond);
                _monitorService.RemoveAllBeforeAsync(iotSignals.Last().timestamp);
            }

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", iotSignals);
            _logger.LogInformation(
                "Sample Service did something.");
        }
    }
}
