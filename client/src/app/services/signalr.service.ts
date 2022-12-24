import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { SignalREvent } from 'app/enums/signalr-events.enum';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private readonly path: string = 'http://localhost:7095/iotSignalsHub';
    private connection: HubConnection;

    constructor() { }

    connect() {
        this.connection = new HubConnectionBuilder()
            .withUrl(this.path)
            .build();

        this.connection.start()
            .then(() => this.connection.invoke('EstablishConnection', 'Start'));
    }

    listen(eventName: SignalREvent) {
        return new Observable((subscriber) => {
            this.connection.on(eventName, data => {
                subscriber.next(data);
            });
        })
    }
}