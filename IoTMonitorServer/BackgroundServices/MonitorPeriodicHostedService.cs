namespace IoTMonitorServer.BackgroundServices
{
    public class MonitorPeriodicHostedService : BackgroundService
    {
        private readonly ILogger<MonitorPeriodicHostedService> _logger;
        private readonly TimeSpan _period = TimeSpan.FromSeconds(1);
        private readonly IServiceScopeFactory _factory;
        private int _executionCount = 0;
        public bool IsEnabled { get; set; } = true;

        public MonitorPeriodicHostedService(
            ILogger<MonitorPeriodicHostedService> logger,
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
                        MonitorBackgroundService monitorBackgroundService = asyncScope.ServiceProvider.GetRequiredService<MonitorBackgroundService>();
                        await monitorBackgroundService.RefreshMonitorAsync();
                        _executionCount++;
                        _logger.LogInformation(
                            $"Executed MonitorPeriodicHostedService - Count: {_executionCount}");
                    }
                    else
                    {
                        _logger.LogInformation(
                            "Skipped MonitorPeriodicHostedService");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogInformation(
                        $"Failed to execute MonitorPeriodicHostedService with exception message {ex.Message}. Good luck next round!");
                }
            }
        }
    }
}
