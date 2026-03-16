using Microsoft.AspNetCore.SignalR;

namespace FractooAPI.Hubs
{
    public class NotificationHub : Hub
    {
        // Clients will connect to this hub and can receive notifications.
        // E.g., SendMessage method could be defined here if clients send messages to server,
        // but typically the server just broadcasts to clients.
        
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}
