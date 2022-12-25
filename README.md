# IoT Monitor
## Prerequisites
### Global
- Typescript **4.3.5**
- NodeJS **12.14.1**
- NPM **6.13.4**

### Server
- ASP.NET **6.0**
- MongoDB Driver **12.18.0**
- MongoDB **4.4.3**

### Client
- [Angular CLI](https://github.com/angular/angular-cli) **12.2.10**
- [Angular Universal SSR](https://angular.io/guide/universal) **12.1.3**
- Material UI **12.2.13**

## Installation
### IoT Device
1. `cd` into `IoTDevice` folder and install `npm` packages
   ```
   npm i
   ```

### MongoDB
1. Download and install `MongoDB` **4.4.3** (or the closest version) from the [MongoDB Community Server Download](https://www.mongodb.com/try/download/community) page
2. Once installed run the `MongoDB` shell
   ```
   mongo
   ```
3. Create the `iot-monitor` DB
   ```
   use iot-monitor
   ```
4. Create the `monitor` and `alarms` collections
   ```
   db.createCollection("monitor")
   db.createCollection("alarms")
   ```
5. Create the `iot-monitor` admin user
   ```
   db.createUser({ user: "iot-monitor-admin", pwd: "1234", roles: [{ role: "dbAdmin", db: "iot-monitor" }]})
   ```

### Server
1. Run `Visual Studio`, click `Open a project or solution` and navigate to the `IoTMonitorServer` folder
2. Double click `IoTMonitorServer.sln`
3. Once the solution is done loading click `Project` from the top menu and then `Manage NuGet Packages...`
4. Click the `Browse` tab and search for `MongoDB.Driver` version **12.18.0**
5. Install `MongoDB Driver`

### Client
1. Install `Angular CLI` **12.2.10** gloablly
   ```
   npm install -g @angular/cli@12.2.10
   ```

2. Install `Typescript` **4.3.5** globally
   ```
   npm install -g typescript@4.3.5
   ```

3. `cd` into `client` folder and install `npm` packages
   ```
   npm i
   ```

## Running
### Server
1. Go to `Visual Studio` and press `F5` to run the `server`

### Client
1. Open the `client` folder with `VSCode`
   ```
   code client
   ```
2. In `VSCode` open the terminal by pressing `Ctrl + ~` and run the following command:
   ```
   npm run dev:ssr
   ```

3. When the build finishes open any browser and navigate to [http://localhost:4200](http://localhost:4200)
4. There you'll see the `IoT Monitor` page

### IoT Device
1. Open `IoTDevice` folder with `VSCode`
   ```
   code IoTDevice
   ```

2. In `VSCode` press `F5` and the `IoT Device` will start generating and trasmitting `IoT` signals to the server (`tail` the log file using `tail -f log/iot-device.log`)

### Monitor Page
- In the `Monitor` page you'll see the graphs refresh with the most recent 100 readings every second
- Anomalies will appear as **red dots** in the graphs (might take a few seconds to actually see anomalies because their random)

### Alarms Page
- Navigate to the `Alarms` page from the side menu (`hamburger` icon on top left-hand side) and watch the `Alarms` table being populated in real-time

## Cleanup
### MongoDB
1. To truncate the `MongoDB` collections first run the mongo shell
   ```
    mongo
   ```
2. Switch to `iot-monitor` DB
   ```
   use iot-monitor
   ```

3. Then delete all documents in `monitor` and `alarms` collections
   ```
   db['monitor'].deleteMany({})
   db['alarms'].deleteMany({})
   ```