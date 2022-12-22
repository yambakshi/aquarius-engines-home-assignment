using Microsoft.AspNetCore.SignalR;
using SignalRChat.Hubs;

namespace IoTMonitorServer.BackgroundServices
{
    public class SampleService
    {
        private readonly ILogger<SampleService> _logger;
        private readonly IHubContext<IoTSignalsHub> _hubContext;

        public SampleService(
            ILogger<SampleService> logger,
            IHubContext<IoTSignalsHub> hubContext)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task DoSomethingAsync()
        {
            await Task.Delay(100);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "FUCK YOU");
            _logger.LogInformation(
                "Sample Service did something.");
        }
    }
}
