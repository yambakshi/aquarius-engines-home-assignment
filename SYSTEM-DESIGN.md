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
  - Fetches most recent 1000 signals from `IoT Signals` collection every 1 seconds (because the client needs to refresh every 1 second)
  - Deletes oldest 1000 signals from `IoT Signals` collection every 2 seconds (thus maintaining 2K documents)

### Client
- **Alarms Page** - Goes over the 1000 new signals, filters the signals that are flagged with `out_of_bounds` and adds them to the table.
- **Monitor Page** - Takes most recent 100 signals from the received 1000 signals and updates the graphs.

# System Design - Pros & Cons
## Cons
### Performence
- The server will perform 2 Inserts every 2-5 seconds of stream (1 into `IoT Signals` collection and 1 into `Alarms` collection)
- The server will perform 1 fetch and 1 delete on `IoT Signals` collection every 2 seconds (on a background thread).