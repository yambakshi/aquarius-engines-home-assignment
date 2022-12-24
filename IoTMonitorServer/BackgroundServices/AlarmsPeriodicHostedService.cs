namespace IoTMonitorServer.BackgroundServices
{
    public class AlarmsPeriodicHostedService : BackgroundService
    {
        private readonly ILogger<AlarmsPeriodicHostedService> _logger;
        private readonly TimeSpan _period = TimeSpan.FromSeconds(1);
        private readonly IServiceScopeFactory _factory;
        private int _executionCount = 0;
        public bool IsEnabled { get; set; } = true;

        public AlarmsPeriodicHostedService(
            ILogger<AlarmsPeriodicHostedService> logger,
            IServiceScopeFactory factory)
        {
            _logger = logger;
            _factory = factory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new PeriodicTimer(_period);
            while (
                !stoppingToken.IsCancellationRequested &&
                await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    if (IsEnabled)
                    {
                        await using AsyncServiceScope asyncScope = _factory.CreateAsyncScope();
                        AlarmsBackgroundService alarmsBackgroundService = asyncScope.ServiceProvider.GetRequiredService<AlarmsBackgroundService>();
                        await alarmsBackgroundService.RefreshAlarmsAsync();
                        _executionCount++;
                        _logger.LogInformation(
                            $"Executed AlarmsBackgroundService - Count: {_executionCount}");
                    }
                    else
                    {
                        _logger.LogInformation(
                            "Skipped AlarmsBackgroundService");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogInformation(
                        $"Failed to execute AlarmsBackgroundService with exception message {ex.Message}. Good luck next round!");
                }
            }
        }
    }
}
