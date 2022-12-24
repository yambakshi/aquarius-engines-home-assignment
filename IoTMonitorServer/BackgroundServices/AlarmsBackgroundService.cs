using IoTMonitorServer.Services;
using Microsoft.AspNetCore.SignalR;
using SignalRChat.Hubs;

namespace IoTMonitorServer.BackgroundServices
{
    public class AlarmsBackgroundService
    {
        private readonly ILogger<AlarmsBackgroundService> _logger;
        private readonly AlarmsService _alarmsService;
        private readonly IHubContext<IoTSignalsHub> _hubContext;

        public AlarmsBackgroundService(
            ILogger<AlarmsBackgroundService> logger,
            AlarmsService alarmsService,
            IHubContext<IoTSignalsHub> hubContext)
        {
            _logger = logger;
            _alarmsService = alarmsService;
            _hubContext = hubContext;
        }

        public async Task RefreshAlarmsAsync()
        {
            await Task.Delay(100);
            var alarms = await _alarmsService.GetAsync();
            await _hubContext.Clients.All.SendAsync("AlarmsRefresh", alarms);
            _logger.LogInformation(
                "Alarms were refreshed");
        }
    }
}
