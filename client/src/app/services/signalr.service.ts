import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
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
            .then(() => this.connection.invoke("SendMessage", "Establish Connection"));
    }

    listen() {
        return new Observable((subscriber) => {
            this.connection.on("ReceiveMessage", data => {
                subscriber.next(data);
            });
        })
    }
}