# IoT Monitor - Server
## Technologies
- ASP.NET 6.0
- SignalR
- MongoDB Driver 12.18.0
- MongoDB 4.4.3


# ASP.NET
- [Enable Cross-Origin Requests (CORS) in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-7.0)
- [Create a web API with ASP.NET Core and MongoDB](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-6.0&tabs=visual-studio)
- [Tutorial: Create a web API with ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-6.0&tabs=visual-studio)

## Periodic Tasks
### Links
- [Run and manage periodic background tasks in ASP.NET Core 6 with C#](https://medium.com/medialesson/run-and-manage-periodic-background-tasks-in-asp-net-core-6-with-c-578a31f4b7a3)
- [Background tasks with hosted services in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-6.0&tabs=visual-studio)

## SignalR
- [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr)
- [Send messages from outside a hub](https://learn.microsoft.com/en-us/aspnet/core/signalr/hubcontext?view=aspnetcore-6.0)
- [Tutorial: Get started with ASP.NET Core SignalR](https://learn.microsoft.com/en-us/aspnet/core/tutorials/signalr?WT.mc_id=dotnet-35129-website&view=aspnetcore-6.0&tabs=visual-studio)
- [Overview of ASP.NET Core SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-6.0)
- [.NET Core with SignalR and Angular – Real-Time Charts](https://code-maze.com/netcore-signalr-angular-realtime-charts/)
- [Security considerations in ASP.NET Core SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/security?view=aspnetcore-6.0)

## D3
- [Line Chart, Percent Change](https://observablehq.com/@d3/gallery?collection=@observablehq/visualization)
- [Line Chart](https://observablehq.com/@d3/line-chart)
- [d3/d3-time-format](https://github.com/d3/d3-time-format)
- [Zoomable Bar Chart](https://observablehq.com/@d3/zoomable-bar-chart)

- [Most basic line chart in d3.js](https://d3-graph-gallery.com/graph/line_basic.html)
- [Most basic connected scatter plot](https://d3-graph-gallery.com/graph/connectedscatter_basic.html)

V Document .NET ASP.NET Links
V Compare pubsub to websockets to client polling
V create alarms table
V flag out of bounds signals in the db

- add logging to server
- [add tooltip to graphs](https://observablehq.com/@d3/line-with-tooltip)
- add zoom to graphs
X - fetch all data on each refresh (currently only the in bounds data is fetched because of the flag)
X - maybe add state mgmt in angular
V - show anomalies as red dots in the graph
- add setup and running readme
V - implement sine wave functionality
X - maybe use queue in the server
- remove all commented code
- Fix mongo connections string
- add filter to alarms table
- Rename server folder to `server`