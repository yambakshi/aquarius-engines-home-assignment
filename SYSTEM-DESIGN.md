# IoT Monitor - System Design
## DB
### Collections
1. **Alarms** - Stores only the `out_of_bounds` signals
   - Timestamp
   - Value
   - Type (`Sine` / `State`)

2. **IoT Signals** - Stores last 2 seconds of all signals transmitted from `IoT Device` (1000 * 2 = 2,000 signals)
   - Timestamp
   - Value
   - Type (`Sine` / `State`)
   - Flag ('out_of_bounds')

## Initial Fetch
### Server
- **GET /api/alarms** - Fetches all documents from `Alarms` collection (with pagination functionality)
   > *Optimization Suggestion*
Get all documents from DB just to know the total amount but send only 100 most recent alarms to the client (which are 10 pages in the table).
Then fetch the next 10 signals every time the user goes to the next page using pagination.
- **GET /api/iotsignals?limit=100** - Fetches 100 most recent docuemnts from `IoT Signals` Collection

### Client
- **Alarms Page** - Fetches 10 alarms per page from `GET /api/alarms` endpoint and displays them in a table page.
- **Monitor Page** - Fetches 100 most recent docuemnts from `GET /api/iotsignals?limit=100` endpoint.

## IoT Device Running
The `IoT Device` transmits 2 signals to the server every 2 milliseconds (1000 signals every second).
### Server
- **Processing `IoT Device` Stream**
  - Inserts all received signals into `IoT Signals` collection
  - Inserts only `out_of_bounds` signals into `Alarms` collection

- **Sending Updates to Client**
  - Fetches all signals from `IoT Signals` collection every 1 seconds (because the client refreshes every 1 second) and returns the first 1000 IoT signals fetched.
  - If the amount of IoT signals fetched is greater than or equals to 2000 (i.e 2 seconds have passed), the server will delete the 1000 signals that are older than the timestamp of the 1000th most recent IoT signal fetched from `IoT Signals` collection, thus keeping at least the last second of transmitted signals (i.e 1000 signals) at all times.

### Client
- **Alarms Page** - Goes over the 1000 new signals, filters the signals that are flagged with `out_of_bounds` and adds them to the table.
- **Monitor Page** - Takes most recent 100 signals from the received 1000 signals and updates the graphs.