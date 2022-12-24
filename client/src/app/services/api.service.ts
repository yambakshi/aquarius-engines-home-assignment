import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseIoTSignal } from '@models/base-iot-signal';
import { MonitorIoTSignal } from '@models/monitor-iot-signal';
import { SignalRService } from './signalr.service';
import { isPlatformBrowser } from '@angular/common';
import { IoTSignalStreamlType } from 'app/enums/iot-signal-stream-type.enum';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private iotSignalsSubjects: {
        monitor: BehaviorSubject<MonitorIoTSignal[]>,
        alarms: BehaviorSubject<BaseIoTSignal[]>
    };
    private httpOptions: {} = {
        headers: {},
        responseType: 'json'
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private signalRService: SignalRService,
        private http: HttpClient) {
        this.iotSignalsSubjects = {
            monitor: new BehaviorSubject<MonitorIoTSignal[]>([]),
            alarms: new BehaviorSubject<BaseIoTSignal[]>([])
        }

        if (isPlatformBrowser(this.platformId)) {
            this.establishSignalRConnection();
        }
    }

    private establishSignalRConnection(): void {
        this.signalRService.connect();
        this.signalRService.listen().subscribe((data: any) => {
            if (!Array.isArray(data)) return;
            this.setIoTSignals(IoTSignalStreamlType.Monitor, data);
        });
    }

    getIoTSignalsObservable(streamType: IoTSignalStreamlType): Observable<any[]> {
        return this.iotSignalsSubjects[streamType].asObservable();
    }

    setIoTSignals(streamType: IoTSignalStreamlType, iotSignals: MonitorIoTSignal[]): void {
        this.iotSignalsSubjects[streamType].next(iotSignals);
    }

    getMonitorData(filter: { flag?: string, limit?: number }): any {
        let path = '/api/monitor';
        if (Object.keys(filter).length > 0) {
            const encodedParams = Object.entries(filter).reduce((acc, [key, val]) =>
                ({ ...acc, [key]: encodeURIComponent(val) }), {});
            const queryParams = new URLSearchParams(encodedParams);
            path += `?${queryParams.toString()}`;
        }

        return this.http.get(path, this.httpOptions)
            .pipe(
                map((res: any) => {
                    this.setIoTSignals(IoTSignalStreamlType.Monitor, res);
                    return res;
                }),
                catchError(this.handleError));
    }

    getAlarms(): any {
        const path = '/api/alarms';
        return this.http.get(path, this.httpOptions)
            .pipe(
                map((res: any) => {
                    this.setIoTSignals(IoTSignalStreamlType.Alarms, res);
                    return res;
                }),
                catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof HttpErrorResponse) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }

        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
    }
}