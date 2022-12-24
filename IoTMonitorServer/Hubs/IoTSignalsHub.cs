using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class IoTSignalsHub : Hub
    {
        public async Task EstablishConnection(string message)
        {
            await Clients.All.SendAsync("ConnectionEstablished", message);
        }
    }
}