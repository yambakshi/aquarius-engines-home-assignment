import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private readonly path: string = 'http://localhost:7095/iotSignalsHub';
    private connection: HubConnection;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl(this.path)
            .build();

        this.connect();
        this.listen();
    }

    connect() {
        this.connection.start()
            .then(() => {
                const asdf = this.connection.invoke("SendMessage", "Hello")
                return asdf;
            });
    }

    listen() {
        this.connection.on("ReceiveMessage", data => {
            console.log(data);
        });

    }
}