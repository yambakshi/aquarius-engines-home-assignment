using IoTMonitorServer.BackgroundServices;
using IoTMonitorServer.Models;
using IoTMonitorServer.Services;
using SignalRChat.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddSignalR();

builder.Services.AddScoped<MonitorBackgroundService>();
builder.Services.AddScoped<AlarmsBackgroundService>();
builder.Services.AddSingleton<MonitorPeriodicHostedService>();
builder.Services.AddHostedService(
    provider => provider.GetRequiredService<MonitorPeriodicHostedService>());

builder.Services.AddSingleton<AlarmsPeriodicHostedService>();
builder.Services.AddHostedService(
    provider => provider.GetRequiredService<AlarmsPeriodicHostedService>());

builder.Services.Configure<IoTMonitorDatabaseSettings>(
    builder.Configuration.GetSection("IoTMonitorDatabase"));

builder.Services.AddSingleton<MonitorService>();
builder.Services.AddSingleton<AlarmsService>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder =>
{
    builder.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .WithMethods("GET", "POST")
        .AllowCredentials();
});

app.UseAuthorization();

app.MapHub<IoTSignalsHub>("/iotSignalsHub");

app.MapControllers();

app.Run();
